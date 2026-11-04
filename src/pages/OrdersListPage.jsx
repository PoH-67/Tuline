import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { getStoredOrders } from '../services/orderService';
import {
  ClipboardList,
  Clock,
  Plus,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function OrdersListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('semua');

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  // Filter Logic:
  // Jika belum dilunasi (!o.isPaid), masuk ke tab 'aktif' dan BUKAN 'selesai'
  const filteredOrders = orders.filter((o) => {
    if (o.status === 'cancelled') return false;

    const isPaid = !!o.isPaid;

    if (filter === 'aktif') {
      // Masih aktif: belum lunas ATAU masih proses perbaikan
      return !isPaid;
    }
    if (filter === 'selesai') {
      // Selesai: HANYA jika sudah dilunasi
      return isPaid;
    }
    return true;
  });

  return (
    <ResponsiveLayout pageTitle="Pesanan Saya" showBack={false}>
      <div className="w-full flex-1 flex flex-col gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {['semua', 'aktif', 'selesai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold capitalize transition cursor-pointer ${
                filter === tab
                  ? 'bg-[#ffde59] text-black shadow-xs border border-amber-300'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'aktif' ? 'Aktif' : tab === 'selesai' ? 'Selesai' : 'Semua'}
            </button>
          ))}
        </div>

        {/* Orders Grid (Desktop 2-cols / Mobile 1-col) */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((ord) => {
              const isPaid = !!ord.isPaid;
              const isAwaitingPayment = !isPaid && (ord.stepIndex >= 6 || ord.status === 'selesai' || ord.status === 'menunggu_pembayaran');

              // Tentukan URL tujuan saat kartu diklik
              const targetUrl = isAwaitingPayment || isPaid
                ? `/pesanan/${ord.id}/invoice`
                : `/pesanan/${ord.id}`;

              return (
                <div
                  key={ord.id}
                  onClick={() => navigate(targetUrl)}
                  className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200 cursor-pointer hover:border-[#ff7f11] hover:shadow-md transition flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-extrabold text-gray-900">{ord.orderCode}</span>
                    
                    {/* Badge Status Sesuai Ketentuan User */}
                    {isPaid ? (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Selesai</span>
                      </span>
                    ) : isAwaitingPayment ? (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff7f11] border border-orange-200 animate-pulse flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Pembayaran</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#0c1b33]">
                        Sedang Berjalan
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-black group-hover:text-[#ff7f11] transition">
                      {ord.category}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      Teknisi: {ord.workerName} ({ord.workerSpecialty})
                    </p>
                    {isAwaitingPayment && (
                      <p className="text-[11px] text-[#ff7f11] font-bold mt-1">
                        👉 Perbaikan selesai. Menunggu pelunasan biaya.
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ord.visitDate || 'Hari ini'} ({ord.visitTime || 'Segera'})</span>
                    </span>
                    <span className="text-sm font-extrabold text-[#0c1b33]">
                      Rp {(ord.totalFee || 205000).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 flex flex-col items-center justify-center min-h-[260px]">
            <ClipboardList className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              {filter === 'aktif' ? 'Tidak Ada Pesanan Aktif' : filter === 'selesai' ? 'Belum Ada Pesanan Selesai' : 'Belum Ada Pesanan'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Semua riwayat dan status panggilan teknisi Anda akan tampil rapi di sini.
            </p>
            <button
              onClick={() => navigate('/order/new')}
              className="mt-4 px-5 py-2.5 bg-[#ffde59] text-black font-extrabold text-xs rounded-full shadow-xs hover:bg-yellow-400 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Panggil Teknisi Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}
