const FAVORITES_KEY = 'benerin_favorite_workers_v1';

export const getFavoriteWorkers = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveFavoriteWorkers = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
};

export const isFavoriteWorker = (workerId) => {
  const list = getFavoriteWorkers();
  return list.some((w) => w.id === workerId);
};

export const addFavoriteWorker = (worker) => {
  const list = getFavoriteWorkers();
  if (!list.some((w) => w.id === worker.id)) {
    const updated = [
      {
        id: worker.id,
        name: worker.name,
        photoURL: worker.photoURL || '/assets/logo.png',
        specialty: worker.specialty,
        rating: worker.rating || 4.9,
        distance: worker.distance || '2,1 km dari lokasi',
        category: worker.category,
        categoryKey: worker.categoryKey || 'elektronik',
        visitFee: worker.visitFee || 50000,
      },
      ...list,
    ];
    saveFavoriteWorkers(updated);
    return updated;
  }
  return list;
};

export const removeFavoriteWorker = (workerId) => {
  const list = getFavoriteWorkers();
  const updated = list.filter((w) => w.id !== workerId);
  saveFavoriteWorkers(updated);
  return updated;
};

export const toggleFavoriteWorker = (worker) => {
  if (isFavoriteWorker(worker.id)) {
    return removeFavoriteWorker(worker.id);
  } else {
    return addFavoriteWorker(worker);
  }
};
