import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const LOCAL_STORAGE_ORDERS = 'benerin_orders_v2';

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
};

export const createOrder = async (orderPayload) => {
  const localId = 'ord_' + Date.now();
  const newOrder = {
    id: localId,
    orderCode: 'BNR-' + Math.floor(100000 + Math.random() * 900000),
    userId: orderPayload.userId || 'guest',
    category: orderPayload.category || 'Perangkat Elektronik',
    subCategory: orderPayload.subCategory || 'Kulkas & Pendingin',
    problemDetail: orderPayload.problemDetail || '',
    address: orderPayload.address || '',
    visitDate: orderPayload.visitDate || '',
    visitTime: orderPayload.visitTime || '',
    notes: orderPayload.notes || '',
    paymentMethod: orderPayload.paymentMethod || 'Saku BENERIN',
    isPaid: false,
    workerId: orderPayload.workerId || 'w-1',
    workerName: orderPayload.workerName || 'Ilham Sersa',
    workerPhoto: orderPayload.workerPhoto || '/assets/ilham.png',
    workerSpecialty: orderPayload.workerSpecialty || 'spesialis peralatan rumah tangga',
    workerPhone: orderPayload.workerPhone || '0812-3456-7890',
    visitFee: orderPayload.visitFee || 55000,
    repairFee: orderPayload.repairFee || 150000,
    totalFee: (orderPayload.visitFee || 55000) + (orderPayload.repairFee || 150000),
    status: 'teknisi_menerima', // 'menunggu_konfirmasi' | 'teknisi_menerima' | 'menuju_lokasi' | 'pemeriksaan' | 'estimasi' | 'selesai'
    stepIndex: 2, // 1 to 6
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orders = getStoredOrders();
  const updatedOrders = [newOrder, ...orders];
  saveStoredOrders(updatedOrders);

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const syncedOrders = updatedOrders.map((o) => (o.id === localId ? { ...o, id: docRef.id } : o));
    saveStoredOrders(syncedOrders);
    return { ...newOrder, id: docRef.id };
  } catch (err) {
    console.warn('Firestore addDoc fallback:', err.message);
    return newOrder;
  }
};

export const getOrderById = (orderId) => {
  const orders = getStoredOrders();
  return orders.find((o) => o.id === orderId) || null;
};

export const updateOrderStatus = async (orderId, newStatus, stepIndex, extraData = {}) => {
  const orders = getStoredOrders();
  const updatedOrders = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        status: newStatus,
        stepIndex: stepIndex !== undefined ? stepIndex : o.stepIndex,
        ...extraData,
        updatedAt: new Date().toISOString(),
      };
    }
    return o;
  });
  saveStoredOrders(updatedOrders);

  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status: newStatus,
      stepIndex,
      ...extraData,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore updateDoc fallback:', err.message);
  }

  return updatedOrders.find((o) => o.id === orderId);
};

export const cancelOrder = async (orderId) => {
  return updateOrderStatus(orderId, 'cancelled', 0, { isCancelled: true });
};
