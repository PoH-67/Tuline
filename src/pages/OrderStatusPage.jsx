import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import InteractiveOrderMap from '../components/InteractiveOrderMap';
import { getOrderById, updateOrderStatus, cancelOrder } from '../services/orderService';
import {
  ArrowLeft,
  Check,
  Phone,
  MessageCircle,
  Navigation,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react';

export default function OrderStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

    const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(27.3);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const loaded = getOrderById(id);
    if (loaded) {
      setOrder(loaded);
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.1) return 0.0;
        return Number((prev - 0.05).toFixed(2));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Automatic 10-second delay per step until the end
  useEffect(() => {
    if (!order || order.stepIndex >= 6 || order.status === 'cancelled' || order.status === 'selesai' || order.status === 'menunggu_pembayaran') {
      return;
    }

    setSecondsLeft(10);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoNextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.id, order?.stepIndex, order?.status]);

  const handleAutoNextStep = async () => {
    if (!order) return;
    const currentStep = order.stepIndex || 2;
    const nextIndex = currentStep + 1;
    let nextStatus = 'teknisi_menerima';

    if (nextIndex === 3) nextStatus = 'menuju_lokasi';
    else if (nextIndex === 4) nextStatus = 'pemeriksaan';
    else if (nextIndex === 5) nextStatus = 'estimasi';
    else if (nextIndex >= 6) {
      nextStatus = 'menunggu_pembayaran';
      const updated = await updateOrderStatus(order.id, 'menunggu_pembayaran', 6, { isPaid: false });
      setOrder(updated);
      setTimeout(() => {
        navigate(`/pesanan/${order.id}/invoice`);
      }, 2500);
      return;
    }

    const updated = await updateOrderStatus(order.id, nextStatus, nextIndex);
    setOrder(updated);
  };

  const handleCancel = async () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      await cancelOrder(order.id);
      navigate('/');
    }
  };

  if (!order) {
    return (
      <ResponsiveLayout
        pageTitle="Status Pesanan"
        showBack
        onBack={() => navigate('/')}
        hideTopNav
        hideBottomNav
      >
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-gray-500 text-sm">Memuat data pesanan...</p>
        </div>
      </ResponsiveLayout>
    );
  }

  const steps = [
    { title: 'Menunggu Konfirmasi', desc: 'Pesanan dikirimkan ke teknisi terdekat' },
    { title: 'Teknisi Menerima Pesanan', desc: 'Teknisi menyetujui jadwal panggilan' },
    { title: 'Teknisi Menuju Lokasi', desc: 'Dalam perjalanan dengan perkakas lengkap' },
    { title: 'Pemeriksaan Kerusakan', desc: 'Pengecekan langsung di rumah pelanggan' },
    { title: 'Estimasi & Persetujuan Biaya', desc: 'Transparansi rincian biaya pengerjaan' },
    { title: 'Perbaikan Selesai & Pembayaran', desc: 'Perbaikan tuntas dan bergaransi 30 hari' },
  ];

  const currentStep = order.stepIndex || 2;

  return (
    <ResponsiveLayout
      pageTitle="Status Pesanan"
      showBack
      onBack={() => navigate('/')}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full flex-1 flex flex-col gap-6">
        
        {/* Top Header Banner */}
        <div className="bg-[#ffde59] rounded-3xl p-5 md:p-6 shadow-sm border border-yellow-300 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold font-jakarta text-[#0c1b33]">
              Status Perjalanan Pesanan
            </h1>
            <p className="text-xs text-black/75 mt-0.5">
              Kode Pesanan: <span className="font-extrabold">{order.orderCode}</span> • Layanan: {order.category}
            </p>
          </div>
          <span className="bg-white/90 text-[#ff7f11] font-extrabold text-xs px-3 py-1.5 rounded-full shadow-2xs">
            {order.status === 'selesai' ? 'Selesai' : 'Tahap Aktif'}
          </span>
        </div>

        {/* 2-Columns on Desktop / 1-Column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Map & Technician Info */}
          <div className="md:col-span-6 flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200">
              {/* Interactive Map Leaflet with Live Telemetry */}
              <InteractiveOrderMap
                stepIndex={currentStep}
                technicianName={order.workerName}
              />

              {/* Countdown & Worker Details */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Estimasi Tiba</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-extrabold text-[#e95322] font-jakarta">
                      {countdown.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-gray-600">Menit</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-300">
                    <img
                      src={order.workerPhoto || '/assets/ilham.png'}
                      alt={order.workerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black">{order.workerName}</h4>
                    <p className="text-xs text-gray-500">{order.workerSpecialty}</p>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                <a
                  href={`tel:${order.workerPhone || '08123456789'}`}
                  className="py-2.5 px-4 bg-[#f7f5fb] hover:bg-gray-200 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-[#ff7f11]" />
                  <span>Hubungi Telepon</span>
                </a>
                <button
                  onClick={() => alert(`Membuka chat WhatsApp dengan ${order.workerName}`)}
                  className="py-2.5 px-4 bg-[#ffde59] hover:bg-yellow-400 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-black" />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Pipeline & Simulator */}
          <div className="md:col-span-6 flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4">
                  Tahapan Perjalanan Pesanan
                </h3>

                <div className="flex flex-col gap-3.5">
                  {steps.map((st, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                      <div key={st.title} className="flex items-start gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-extrabold ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-[#ff7f11] text-white shadow-sm ring-4 ring-orange-100'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
                        </div>

                        <div className="flex-1">
                          <h4
                            className={`text-sm ${
                              isCurrent
                                ? 'font-extrabold text-[#0c1b33]'
                                : isCompleted
                                ? 'font-bold text-gray-800'
                                : 'font-medium text-gray-400'
                            }`}
                          >
                            {st.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                            {isCurrent ? `${st.desc} (Tahap aktif).` : st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

                            {/* Automatic 10-Second Progress Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3">
                {currentStep < 6 && order.status !== 'selesai' ? (
                  <div className="bg-[#fff9e6] border border-amber-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7f11] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff7f11]"></span>
                        </span>
                        <span className="text-xs font-bold text-[#0c1b33]">
                          Menuju Tahap {currentStep + 1} ({steps[currentStep]?.title || 'Selesai'})
                        </span>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-[#ff7f11] bg-white px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                        {secondsLeft}s
                      </span>
                    </div>

                    {/* Progress Bar (0 to 100% over 10 seconds) */}
                    <div className="w-full bg-amber-100/70 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ff7f11] h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${Math.min(100, Math.max(0, ((10 - secondsLeft) / 10) * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Update otomatis setiap 10 detik</span>
                      <button
                        onClick={handleAutoNextStep}
                        className="text-[#ff7f11] font-bold hover:underline cursor-pointer"
                      >
                        Percepat Langsung ⚡
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-800">
                        🎉 Perbaikan Selesai & Berhasil
                      </h4>
                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        Mengalihkan ke nota rincian & invoice pengerjaan...
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/pesanan/${order.id}/invoice`)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Buka Invoice
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCancel}
                  className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-red-600 transition"
                >
                  Batalkan Pesanan
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </ResponsiveLayout>
  );
}
