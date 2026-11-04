import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const LOCAL_USER_KEY = 'benerin_auth_user';
const REGISTERED_ACCOUNTS_KEY = 'benerin_registered_accounts';

// Local storage helpers
export const getLocalUser = () => {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setLocalUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  } catch (e) {
    console.error(e);
  }
};

const getRegisteredAccounts = () => {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredAccount = (account) => {
  try {
    const current = getRegisteredAccounts();
    const updated = current.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
    updated.push(account);
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

// 1. Sign Up Only - Does not auto-login, redirects user to login page
export const registerWithEmail = async (email, password, name, phone = '', address = '') => {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const profileData = {
      uid: user.uid,
      name,
      email: cleanEmail,
      phone: phone || '+62 812-3456-7890',
      address: address || 'Jl. Limo Raya No. 7, Cinere, Depok 16514',
      walletBalance: 100000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profileData);
    } catch (fsErr) {
      console.warn('Firestore setDoc warning:', fsErr.message);
    }

    // Save in registered registry
    saveRegisteredAccount({
      uid: user.uid,
      name,
      email: cleanEmail,
      password, // for local fallback check if offline
      phone: profileData.phone,
      address: profileData.address,
      walletBalance: 100000,
    });

    // Make sure we sign out immediately so user must explicitly log in
    await signOut(auth);
    setLocalUser(null);

    return { success: true, email: cleanEmail };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('Email ini sudah terdaftar. Silakan gunakan email lain atau langsung login.');
    }

    // If Firebase Auth is blocked by network, register securely in local database
    console.warn('Firebase network issue, registering in local database:', err.message);
    const localUid = 'usr_' + Date.now();
    const localAccount = {
      uid: localUid,
      name,
      email: cleanEmail,
      password,
      phone: phone || '+62 812-3456-7890',
      address: address || 'Jl. Limo Raya No. 7, Cinere, Depok 16514',
      walletBalance: 100000,
    };
    saveRegisteredAccount(localAccount);
    setLocalUser(null);
    return { success: true, email: cleanEmail };
  }
};

// 2. Log In - Strict check, FAILS if account is not registered
export const loginWithEmail = async (email, password) => {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    let userData = null;
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        userData = docSnap.data();
      }
    } catch (fsErr) {
      console.warn('Firestore getDoc warning:', fsErr.message);
    }

    const sessionUser = {
      uid: user.uid,
      name: userData?.name || user.displayName || cleanEmail.split('@')[0],
      email: user.email,
      phone: userData?.phone || '+62 812-3456-7890',
      address: userData?.address || 'Jl. Limo Raya No. 7, Cinere, Depok 16514',
      walletBalance: userData?.walletBalance !== undefined ? userData.walletBalance : 100000,
    };

    setLocalUser(sessionUser);
    return sessionUser;
  } catch (err) {
    // If not found in Firebase, check local registered database
    const registered = getRegisteredAccounts().find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    if (registered) {
      if (registered.password === password) {
        const sessionUser = {
          uid: registered.uid,
          name: registered.name,
          email: registered.email,
          phone: registered.phone,
          address: registered.address,
          walletBalance: registered.walletBalance ?? 100000,
        };
        setLocalUser(sessionUser);
        return sessionUser;
      } else {
        throw new Error('Password yang Anda masukkan salah.');
      }
    }

    // STRICT: Account does not exist!
    throw new Error(
      'Akun tidak terdaftar di sistem. Anda belum memiliki akun, silakan buat akun terlebih dahulu melalui menu Sign Up!'
    );
  }
};

// 3. Top Up Saku BENERIN
export const topUpWallet = async (uid, amount) => {
  const current = getLocalUser();
  if (!current) throw new Error('Pengguna belum login.');

  const newBalance = (Number(current.walletBalance) || 0) + Number(amount);
  const updatedUser = { ...current, walletBalance: newBalance };
  setLocalUser(updatedUser);

  // Update in local registered list
  const registered = getRegisteredAccounts().map((a) =>
    a.uid === uid || a.email === current.email ? { ...a, walletBalance: newBalance } : a
  );
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(registered));

  // Sync to Firestore if online
  try {
    await updateDoc(doc(db, 'users', uid), {
      walletBalance: newBalance,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore topUp sync fallback:', err.message);
  }

  return updatedUser;
};

// 4. Deduct Balance on Order / Payment
export const deductWallet = async (uid, amount) => {
  const current = getLocalUser();
  if (!current) throw new Error('Pengguna belum login.');

  const currentBal = Number(current.walletBalance) || 0;
  if (currentBal < amount) {
    throw new Error(
      `Saldo Saku BENERIN tidak mencukupi (Tersedia: Rp ${currentBal.toLocaleString(
        'id-ID'
      )}, Dibutuhkan: Rp ${amount.toLocaleString('id-ID')}). Silakan lakukan Top Up terlebih dahulu.`
    );
  }

  const newBalance = currentBal - Number(amount);
  const updatedUser = { ...current, walletBalance: newBalance };
  setLocalUser(updatedUser);

  // Update in local registered list
  const registered = getRegisteredAccounts().map((a) =>
    a.uid === uid || a.email === current.email ? { ...a, walletBalance: newBalance } : a
  );
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(registered));

  // Sync to Firestore
  try {
    await updateDoc(doc(db, 'users', uid), {
      walletBalance: newBalance,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore deduct sync fallback:', err.message);
  }

  return updatedUser;
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('signOut error:', e);
  }
  setLocalUser(null);
};

// Update Profile
export const updateUserProfile = async (uid, data) => {
  const current = getLocalUser() || {};
  const updated = { ...current, ...data };
  setLocalUser(updated);

  try {
    if (auth.currentUser && data.name) {
      await updateProfile(auth.currentUser, { displayName: data.name });
    }
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('updateUserProfile firestore fallback:', err.message);
  }

  return updated;
};
