import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import { getStoredOrders } from '../services/orderService';
import { Search, Plus, ChevronRight } from 'lucide-react';

import iconReparasi from '../assets/figma_icons/beranda_reparasi.svg';
import iconInstalasi from '../assets/figma_icons/beranda_instalasi.svg';
import iconRenovasi from '../assets/figma_icons/beranda_renovasi.svg';
import iconAi from '../assets/figma_icons/beranda_ai.svg';
import iconNota from '../assets/figma_icons/beranda_nota.svg';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [topUpOpen, setTopUpOpen] = useState(false);

  const orders = getStoredOrders();
  const latestOrder = orders.length > 0 ? orders[0] : null;

  const handleActionClick = (actionKey) => {
    navigate(`/order/${actionKey}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/teknisi?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/order/reparasi');
    }
  };

  const mainActions = [
    {
      id: 'reparasi',
      name: 'Reparasi',
      icon: iconReparasi,
      path: '/order/reparasi',
    },
    {
      id: 'instalasi',
      name: 'Instalasi',
      icon: iconInstalasi,
      path: '/order/instalasi',
    },
    {
      id: 'renovasi',
      name: 'Renovasi',
      icon: iconRenovasi,
      path: '/order/renovasi',
    },
  ];

  return (
    <ResponsiveLayout>
      <div className="w-full flex flex-col gap-5">
        
        {/* =========================================
            HEADER KUNING (Saku TULINE, Halo User, Panggil Sekarang, Cari Perbaikan)
            Design presisi sesuai screenshot Figma
           ========================================= */}
        <section className="bg-[#ffde59] rounded-3xl p-5 sm:p-6 shadow-sm border border-yellow-300 flex flex-col gap-4">
          
          {/* Top Row: Saku TULINE Card & Greeting */}
          <div className="flex items-start justify-between gap-3">
            
            {/* Saku TULINE Card */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm w-[170px] sm:w-[210px] flex flex-col justify-between border border-black/5">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold font-jakarta text-[#0c1b33]">
                  Saku TUL<span className="text-[#ff7f11]">INE</span>
                </h3>
                <p className="text-xs sm:text-sm font-extrabold text-[#0c1b33] tracking-tight mt-1">
                  Rp {(currentUser?.walletBalance || 0).toLocaleString('id-ID')},00
                </p>
              </div>

              {/* Tombol Isi Saku */}
              <button
                type="button"
                onClick={() => setTopUpOpen(true)}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff7f11] hover:bg-[#e06d0b] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer self-start"
              >
                <div className="w-3.5 h-3.5 rounded bg-white/20 flex items-center justify-center">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Isi Saku</span>
              </button>
            </div>

            {/* Right: Greeting, Info & Panggil Sekarang Button */}
            <div className="flex-1 text-right flex flex-col items-end justify-between self-stretch">
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold font-jakarta text-[#0c1b33] leading-tight">
                  Halo, <span className="text-[#ff7f11]">{currentUser?.name?.split(' ')[0] || 'User'}!</span>
                </h2>
                <p className="text-[11px] sm:text-xs font-semibold text-black/85 mt-1 leading-snug max-w-[190px] sm:max-w-xs">
                  Ada yang perlu diperbaiki? Serahkan pada ahlinya!
                </p>
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/order/reparasi')}
                  className="bg-[#ff7f11] hover:bg-[#e06d0b] text-white text-xs sm:text-sm font-extrabold py-2 px-4 rounded-full shadow-md active:scale-95 transition cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Panggil Sekarang</span>
                </button>
              </div>
            </div>

          </div>

          {/* Search Bar - Cari Perbaikan */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Perbaikan"
              className="w-full h-11 pl-10 pr-4 bg-white rounded-full text-xs sm:text-sm text-[#0c1b33] placeholder-gray-400 shadow-xs border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#ff7f11]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </form>

        </section>

        {/* =========================================
            3 PILIHAN UTAMA: REPARASI, INSTALASI, RENOVASI
            Desain persis Gambar 2 / Figma (3 card di bawah Cari Perbaikan)
           ========================================= */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {mainActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/80 hover:border-[#ff7f11] shadow-2xs hover:shadow-md transition active:scale-95 flex flex-col items-center justify-center text-center gap-2.5 group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center p-1 group-hover:scale-105 transition">
                  <img
                    src={action.icon}
                    alt={action.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0c1b33] tracking-tight">
                  {action.name}
                </h3>
              </button>
            ))}
          </div>
        </section>

        {/* =========================================
            KONSULTASI AI SECTION
            Kartu kuning dengan inner card Asisten AI TULINE sesuai foto
           ========================================= */}
        <section
          onClick={() => navigate('/konsultasi-ai')}
          className="bg-[#ffde59] rounded-3xl p-4 sm:p-5 shadow-xs border border-yellow-300 cursor-pointer hover:shadow-md transition group"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <img src={iconAi} alt="Konsultasi AI" className="w-5 h-5 object-contain" />
            <h3 className="text-sm sm:text-base font-extrabold font-jakarta text-[#0c1b33]">
              Konsultasi Ai
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-black/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#ff7f11]">
                Asisten AI TULINE
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-700 font-medium mt-0.5">
                Halo! Ceritakan keluhan Anda
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition shrink-0" />
          </div>
        </section>

        {/* =========================================
            NOTA PESANAN SECTION
            Kartu kuning Nota sesuai foto
           ========================================= */}
        <section className="bg-[#ffde59] rounded-3xl p-4 sm:p-5 shadow-xs border border-yellow-300">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <img src={iconNota} alt="Nota" className="w-5 h-5 object-contain" />
              <h3 className="text-sm sm:text-base font-extrabold font-jakarta text-[#0c1b33]">
                Nota
              </h3>
            </div>
            {orders.length > 0 && (
              <button
                onClick={() => navigate('/pesanan')}
                className="text-xs font-bold text-black/80 hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            )}
          </div>

          {latestOrder ? (
            <div
              onClick={() => {
                const isPaid = !!latestOrder.isPaid;
                const isAwaitingPayment = !isPaid && (latestOrder.stepIndex >= 6 || latestOrder.status === 'selesai' || latestOrder.status === 'menunggu_pembayaran');
                navigate(isAwaitingPayment || isPaid ? `/pesanan/${latestOrder.id}/invoice` : `/pesanan/${latestOrder.id}`);
              }}
              className="bg-white rounded-2xl p-4 shadow-2xs border border-black/5 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-gray-900">{latestOrder.orderCode || 'Pesanan Aktif'}</span>
                {latestOrder.isPaid ? (
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    Selesai
                  </span>
                ) : (latestOrder.stepIndex >= 6 || latestOrder.status === 'selesai' || latestOrder.status === 'menunggu_pembayaran') ? (
                  <span className="px-2.5 py-0.5 bg-orange-100 text-[#ff7f11] border border-orange-300 rounded-full font-bold text-[10px]">
                    Pembayaran
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-[#0c1b33] rounded-full font-bold text-[10px]">
                    Sedang Berjalan
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1.5 font-medium line-clamp-1">
                {latestOrder.category} • {latestOrder.workerName}
              </p>
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100 text-xs">
                <span className="text-gray-500">{latestOrder.visitDate} ({latestOrder.visitTime})</span>
                <span className="font-extrabold text-[#0c1b33]">
                  Rp {(latestOrder.visitFee + (latestOrder.repairFee || 0)).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 rounded-2xl p-4 text-center text-xs text-gray-500 font-medium">
              Belum ada pesanan aktif. Pesanan Anda akan tampil di sini.
            </div>
          )}
        </section>

      </div>

      {/* Top Up Modal (terbuka saat klik tombol "Isi Saku") */}
      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </ResponsiveLayout>
  );
}
