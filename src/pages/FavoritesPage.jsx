import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { getFavoriteWorkers, removeFavoriteWorker } from '../services/favoriteService';
import { Star, Heart, Trash2, ArrowRight, UserCheck } from 'lucide-react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favoriteWorkers, setFavoriteWorkers] = useState([]);

  useEffect(() => {
    setFavoriteWorkers(getFavoriteWorkers());
  }, []);

  const handleRemove = (e, workerId) => {
    e.stopPropagation();
    const updated = removeFavoriteWorker(workerId);
    setFavoriteWorkers(updated);
  };

  return (
    <ResponsiveLayout pageTitle="Teknisi Favorit" showBack={false}>
      <div className="w-full flex-1 flex flex-col gap-4">
        
        {favoriteWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteWorkers.map((w) => (
              <div
                key={w.id}
                onClick={() => navigate(`/teknisi/${w.id}`)}
                className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-[#ff7f11] transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-black/5 shrink-0">
                    <img
                      src={w.photoURL}
                      alt={w.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/logo.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-black group-hover:text-[#ff7f11] transition truncate">
                      {w.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{w.specialty}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {w.rating}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{w.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, w.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/order/new?cat=${w.categoryKey || 'elektronik'}`);
                    }}
                    className="px-4 py-2 bg-[#ffde59] hover:bg-yellow-400 text-black text-xs font-extrabold rounded-full transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    Panggil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tampilan Kosong Sesuai Permintaan User */
          <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-gray-200 shadow-xs flex flex-col items-center justify-center min-h-[320px]">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              Belum Ada Teknisi Favorit
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 max-w-sm leading-relaxed">
              Daftar favorit Anda masih kosong. Anda dapat menambahkan teknisi langganan ke favorit dari <b>pesanan yang telah selesai</b> atau melalui <b>profil teknisi</b>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={() => navigate('/pesanan')}
                className="px-4 py-2 bg-[#ffde59] hover:bg-yellow-400 text-[#0c1b33] font-bold text-xs rounded-full shadow-xs transition cursor-pointer"
              >
                Lihat Pesanan Selesai
              </button>
              <button
                onClick={() => navigate('/order/new')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-full transition cursor-pointer"
              >
                Cari Teknisi Baru
              </button>
            </div>
          </div>
        )}

      </div>
    </ResponsiveLayout>
  );
}
