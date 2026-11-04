import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getLocalUser,
  setLocalUser,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  updateUserProfile,
  topUpWallet,
  deductWallet,
} from '../services/authService';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return getLocalUser();
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const stored = getLocalUser();
        if (stored && stored.uid === user.uid) {
          setCurrentUser(stored);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, phone, address) => {
    setLoading(true);
    try {
      // Returns { success: true }, does not auto-login
      const res = await registerWithEmail(email, password, name, phone, address);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const updateProfile = async (data) => {
    if (!currentUser) return;
    const updated = await updateUserProfile(currentUser.uid, data);
    setCurrentUser(updated);
    return updated;
  };

  const topUp = async (amount) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.');
    const updated = await topUpWallet(currentUser.uid, amount);
    setCurrentUser(updated);
    return updated;
  };

  const deduct = async (amount) => {
    if (!currentUser) throw new Error('Silakan login terlebih dahulu.');
    const updated = await deductWallet(currentUser.uid, amount);
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        topUp,
        deduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
