import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { WORKERS } from '../services/workerService';
import { Star, ShieldCheck, MapPin, Wrench } from 'lucide-react';

export default function WorkerSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get('cat') || '';
  const subCategory = searchParams.get('sub') || '';
  const problem = searchParams.get('problem') || '';
  const address = searchParams.get('address') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const notes = searchParams.get('notes') || '';
  const payment = searchParams.get('payment') || 'Saku BENERIN';
  const querySearch = searchParams.get('q') || '';

  const [filterRating, setFilterRating] = useState(false);
  const [filterDistance, setFilterDistance] = useState(false);
  const [sortBy, setSortBy] = useState('rekomendasi');

  // Filter workers based on subcategory, category, query
  let displayedWorkers = [...WORKERS];

  if (subCategory) {
    displayedWorkers = displayedWorkers.filter(
      (w) => w.subCategories && w.subCategories.includes(subCategory)
    );
  } else if (category && category !== 'semua') {
    const catLower = category.toLowerCase();
    displayedWorkers = displayedWorkers.filter(
      (w) =>
        w.categoryKey.toLowerCase() === catLower ||
        (w.categories && w.categories.includes(catLower)) ||
        w.category.toLowerCase().includes(catLower)
    );
  }

  if (querySearch) {
    const q = querySearch.toLowerCase();
    displayedWorkers = displayedWorkers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.specialty.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        (w.subCategories && w.subCategories.some((s) => s.toLowerCase().includes(q)))
    );
  }

  // Filter: Rating >= 4.8
  if (filterRating) {
    displayedWorkers = displayedWorkers.filter((w) => w.rating >= 4.8);
  }

  // Filter: Jarak <= 2.5 km
  if (filterDistance) {
    displayedWorkers = displayedWorkers.filter((w) => {
      const distNum = parseFloat(w.distance.replace(',', '.'));
      return distNum <= 2.5;
    });
  }

  // Sorting: Rekomendasi vs Rating
  if (sortBy === 'rating') {
    displayedWorkers.sort((a, b) => b.rating - a.rating);
  }

  const handleSelectWorker = (workerId) => {
    const params = new URLSearchParams({
      cat: category,
      sub: subCategory,
      problem,
      address,
      date,
      time,
      notes,
      payment,
    });

    navigate(`/teknisi/${workerId}?${params.toString()}`);
  };

  return (
    <ResponsiveLayout
      pageTitle="Hasil Pencarian Teknisi"
      showBack
      onBack={() => navigate(-1)}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full flex-1 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="bg-[#ffde59] rounded-3xl p-5 md:p-6 shadow-sm border border-yellow-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold font-jakarta text-[#0c1b33]">
              Hasil Pencarian Teknisi
            </h1>
            <p className="text-xs sm:text-sm text-black/75 mt-0.5">
              Ditemukan <span className="font-bold text-[#ff7f11]">{displayedWorkers.length} teknisi</span> terverifikasi di area sekitar Anda.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl px-4 py-2 text-xs font-semibold text-gray-700 shadow-2xs border border-black/5 self-start sm:self-auto flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-[#ff7f11]" />
            <span>Layanan: </span>
            <span className="font-extrabold text-[#0c1b33]">
              {subCategory || (category ? category.toUpperCase() : 'Semua Layanan')}
            </span>
          </div>
        </div>

        {/* Filters Section (ONLY: Rekomendasi, Rating >= 4.8, Jarak <= 2.5 km, Rating) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            type="button"
            onClick={() => setSortBy('rekomendasi')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition border cursor-pointer ${
              sortBy === 'rekomendasi'
                ? 'bg-[#0c1b33] text-white border-[#0c1b33] font-bold shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Rekomendasi
          </button>

          <button
            type="button"
            onClick={() => setFilterRating(!filterRating)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition border cursor-pointer ${
              filterRating
                ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ Rating ≥ 4.8
          </button>

          <button
            type="button"
            onClick={() => setFilterDistance(!filterDistance)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition border cursor-pointer ${
              filterDistance
                ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            📍 Jarak ≤ 2.5 km
          </button>

          <button
            type="button"
            onClick={() => setSortBy('rating')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition border cursor-pointer ${
              sortBy === 'rating'
                ? 'bg-[#0c1b33] text-white border-[#0c1b33] font-bold shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Rating Tertinggi
          </button>
        </div>

        {/* Worker Cards Grid (Desktop 3-cols / Tablet 2-cols / Mobile 1-col) */}
        {displayedWorkers.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-xs">
            <p className="text-gray-500 text-sm">Tidak ditemukan teknisi yang memenuhi filter.</p>
            <button
              onClick={() => {
                setFilterRating(false);
                setFilterDistance(false);
                setSortBy('rekomendasi');
              }}
              className="mt-3 px-4 py-2 bg-[#ffde59] text-[#0c1b33] font-bold text-xs rounded-full"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs hover:shadow-md hover:border-[#ff7f11] transition flex flex-col justify-between gap-3 group"
              >
                {/* Header: Photo, Name, Specialty */}
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                    <img
                      src={worker.photoURL}
                      alt={worker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/logo.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#0c1b33] font-jakarta leading-tight truncate">
                      {worker.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                      {worker.specialty}
                    </p>
                  </div>
                </div>

                {/* Badges & Stats */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#0c1b33] font-semibold bg-amber-50 px-2.5 py-1 rounded-xl w-fit">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ff7f11]" />
                    <span>{worker.badge}</span>
                  </div>

                  <div className="text-[11px] text-[#0c1b33] flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{worker.rating}</span>
                    </span>
                    <span className="text-gray-400">({worker.reviewsCount} ulasan)</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{worker.distance}</span>
                    </span>
                  </div>

                  {/* Skills tags */}
                  {worker.subCategories && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.subCategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                      {worker.subCategories.length > 3 && (
                        <span className="text-[10px] text-gray-400 py-0.5">
                          +{worker.subCategories.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Kunjungan mulai:</span>
                    <span className="text-sm font-extrabold text-[#0c1b33]">
                      Rp {worker.visitFee.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectWorker(worker.id)}
                    className="px-4 py-2 bg-[#6b7280] group-hover:bg-[#ff7f11] text-white font-bold text-xs rounded-full shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    Lihat Profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </ResponsiveLayout>
  );
}
