import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import { getWorkerById } from '../services/workerService';
import { createOrder } from '../services/orderService';
import { isFavoriteWorker, toggleFavoriteWorker } from '../services/favoriteService';
import {
  ArrowLeft,
  Share2,
  Star,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Phone,
  AlertCircle,
  Wallet,
  Heart,
} from 'lucide-react';

export default function WorkerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, deduct } = useAuth();

  const worker = getWorkerById(id);

  const category = searchParams.get('cat') || worker.category;
  const subCategory = searchParams.get('sub') || 'Peralatan Rumah Tangga';
  const problem = searchParams.get('problem') || 'Pemeriksaan keluhan kerusakan unit';
  const address = searchParams.get('address') || currentUser?.address || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const notes = searchParams.get('notes') || '';
  const payment = searchParams.get('payment') || 'Saku BENERIN';

  const [bookingLoading, setBookingLoading] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isFav, setIsFav] = useState(isFavoriteWorker(worker.id));

  const handleToggleFav = () => {
    toggleFavoriteWorker(worker);
    setIsFav(!isFav);
  };

  const handleBookNow = async () => {
    // 1. Check login
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk memesan teknisi!');
      navigate('/login');
      return;
    }

    // 2. If payment is Saku BENERIN, check & deduct
    if (payment === 'Saku BENERIN') {
      const balance = Number(currentUser.walletBalance) || 0;
      if (balance < worker.visitFee) {
        setErrorMsg(
          `Saldo Saku BENERIN Anda (Rp ${balance.toLocaleString('id-ID')}) tidak mencukupi untuk biaya kunjungan Rp ${worker.visitFee.toLocaleString('id-ID')}. Silakan Top Up terlebih dahulu.`
        );
        setTopUpOpen(true);
        return;
      }
    }

    setBookingLoading(true);
    try {
      // Deduct visit fee from Saku BENERIN
      if (payment === 'Saku BENERIN') {
        await deduct(worker.visitFee);
      }

      const order = await createOrder({
        userId: currentUser.uid,
        category,
        subCategory,
        problemDetail: problem,
        address,
        visitDate: date,
        visitTime: time,
        notes,
        paymentMethod: payment,
        workerId: worker.id,
        workerName: worker.name,
        workerPhoto: worker.photoURL,
        workerSpecialty: worker.specialty,
        workerPhone: worker.phone,
        visitFee: worker.visitFee,
        repairFee: 150000,
      });

      // Navigate directly to live order status screen
      navigate(`/pesanan/${order.id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kendala saat memesan teknisi.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <ResponsiveLayout
      pageTitle="Profil Teknisi"
      showBack
      onBack={() => navigate(-1)}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full flex-1 flex flex-col gap-6">
        
        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setTopUpOpen(true)}
              className="px-3 py-1 bg-[#ff7f11] text-white font-bold rounded-lg shrink-0 ml-2"
            >
              Top Up Sekarang
            </button>
          </div>
        )}

        {/* Profile Card Header (Responsive Desktop/Mobile) */}
        <div className="bg-[#ffde59] rounded-3xl p-6 shadow-sm border border-yellow-300 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-md relative bg-white shrink-0">
            <img
              src={worker.detailPhotoURL || worker.photoURL}
              alt={worker.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/logo.png';
              }}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold font-jakarta text-[#0c1b33]">
                  {worker.name}
                </h1>
                <button
                  type="button"
                  onClick={handleToggleFav}
                  className="p-1.5 rounded-full bg-white/90 text-rose-500 shadow-2xs hover:scale-110 active:scale-95 transition cursor-pointer"
                  title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
              <span className="hidden sm:inline-block bg-[#ff7f11] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                {worker.badge}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-black/80 font-medium mt-1">
              {worker.specialty}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-3 flex-wrap">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-amber-700 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{worker.rating}</span>
                <span className="text-gray-500 font-normal">({worker.reviewsCount} ulasan)</span>
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-2xs">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{worker.distance}</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                Tersedia Hari Ini
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid (Desktop 2-columns / Mobile 1-column) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Bio & Services */}
          <div className="md:col-span-7 flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200">
              <h3 className="text-sm font-extrabold text-[#0c1b33] mb-2 font-jakarta">
                Tentang Teknisi
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {worker.bio}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200">
              <h3 className="text-sm font-extrabold text-[#0c1b33] mb-3 font-jakarta">
                Daftar Tarif Layanan
              </h3>
              <div className="flex flex-col gap-2.5">
                {worker.services?.map((svc, i) => (
                  <div
                    key={i}
                    className="bg-[#f8f9fe] p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <span className="font-semibold text-gray-800">{svc.name}</span>
                    <span className="font-extrabold text-[#0c1b33]">
                      Rp {svc.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reviews & Booking Summary Box */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Booking Box */}
            <div className="bg-[#fff9e6] rounded-3xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Ringkasan Pemesanan
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-gray-600 font-medium">Biaya Panggilan & Kunjungan:</span>
                  <span className="text-xl font-extrabold text-[#0c1b33] font-jakarta">
                    Rp {worker.visitFee.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  *Biaya perbaikan suku cadang akan disepakati transparan setelah pengecekan langsung di rumah Anda.
                </p>

                {/* Saku BENERIN Deduction Warning */}
                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                  <span className="text-gray-600 flex items-center gap-1.5 font-medium">
                    <Wallet className="w-4 h-4 text-[#ff7f11]" />
                    <span>Saldo Saku Anda:</span>
                  </span>
                  <span className="font-extrabold text-[#0c1b33]">
                    Rp {(currentUser?.walletBalance || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={bookingLoading}
                className="w-full h-12 mt-5 bg-[#ff7f11] hover:bg-[#e06d0b] text-white font-extrabold text-sm rounded-full shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{bookingLoading ? 'Memproses Pesanan...' : 'Pesan Teknisi Ini Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200">
              <h3 className="text-sm font-extrabold text-[#0c1b33] mb-3 font-jakarta">
                Ulasan Pelanggan
              </h3>
              <div className="flex flex-col gap-2.5">
                {worker.reviews?.map((rev, i) => (
                  <div key={i} className="bg-[#fcfcfd] border border-gray-100 p-3 rounded-2xl text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{rev.user}</span>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </ResponsiveLayout>
  );
}
