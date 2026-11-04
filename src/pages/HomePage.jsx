import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import { getStoredOrders } from '../services/orderService';
import {
  Search,
  Plus,
  Wrench,
  Zap,
  Home as HomeIcon,
  MessageCircle,
  Receipt,
  ChevronRight,
  Droplet,
  Armchair,
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [topUpOpen, setTopUpOpen] = useState(false);

  const orders = getStoredOrders();
  const latestOrder = orders.length > 0 ? orders[0] : null;

  const handleCategoryClick = (catKey) => {
    navigate(`/order/new?cat=${catKey}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/teknisi?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/order/new');
    }
  };

  const categories = [
    { id: 'elektronik', name: 'Reparasi', subtitle: 'Elektronik & AC', icon: Wrench, color: 'text-[#ff7f11] bg-orange-50' },
    { id: 'listrik', name: 'Instalasi', subtitle: 'Listrik & Saklar', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { id: 'sipil', name: 'Renovasi', subtitle: 'Sipil & Bangunan', icon: HomeIcon, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'ledeng', name: 'Ledeng', subtitle: 'Pipa & Saluran Air', icon: Droplet, color: 'text-blue-600 bg-blue-50' },
    { id: 'furnitur', name: 'Furnitur', subtitle: 'Mebel & Kayu', icon: Armchair, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <ResponsiveLayout>
      <div className="w-full flex flex-col gap-5">
        
        {/* =========================================
            HEADER KUNING (Saku BENERIN, Halo User, Panggil Sekarang, Cari Perbaikan)
            Design presisi sesuai screenshot Figma
           ========================================= */}
        <section className="bg-[#ffde59] rounded-3xl p-5 sm:p-6 shadow-sm border border-yellow-300 flex flex-col gap-4">
          
          {/* Top Row: Saku BENERIN Card & Greeting */}
          <div className="flex items-start justify-between gap-3">
            
            {/* Saku BENERIN Card */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm w-[170px] sm:w-[210px] flex flex-col justify-between border border-black/5">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold font-jakarta text-[#0c1b33]">
                  Saku BENER<span className="text-[#ff7f11]">IN</span>
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
                  onClick={() => navigate('/order/new')}
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
            KATEGORI LAYANAN SECTION
            Reparasi, Instalasi, Renovasi, Ledeng, Furnitur
           ========================================= */}
        <section>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/80 hover:border-[#ff7f11] shadow-2xs hover:shadow-md transition active:scale-95 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition border border-black/5`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#0c1b33]">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================
            KONSULTASI AI SECTION
            Kartu kuning dengan inner card Asisten AI BENERIN sesuai foto
           ========================================= */}
        <section
          onClick={() => navigate('/konsultasi-ai')}
          className="bg-[#ffde59] rounded-3xl p-4 sm:p-5 shadow-xs border border-yellow-300 cursor-pointer hover:shadow-md transition group"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <MessageCircle className="w-5 h-5 text-[#ff7f11]" />
            <h3 className="text-sm sm:text-base font-extrabold font-jakarta text-[#0c1b33]">
              Konsultasi Ai
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-black/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-[#ff7f11]">
                Asisten AI BENERIN
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
              <Receipt className="w-5 h-5 text-[#ff7f11]" />
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
