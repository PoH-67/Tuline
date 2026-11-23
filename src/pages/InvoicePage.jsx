import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import { getOrderById, updateOrderStatus } from '../services/orderService';
import { isFavoriteWorker, toggleFavoriteWorker } from '../services/favoriteService';
import {
  CheckCircle,
  Star,
  Receipt,
  ShieldCheck,
  Wallet,
  AlertCircle,
  ArrowRight,
  Heart,
} from 'lucide-react';

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, deduct } = useAuth();

  const order = getOrderById(id);
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [paid, setPaid] = useState(order?.isPaid || false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (order?.workerId) {
      setIsFav(isFavoriteWorker(order.workerId));
    }
  }, [order?.workerId]);

  const handleToggleFav = () => {
    if (!order) return;
    const workerObj = {
      id: order.workerId || 'w-1',
      name: order.workerName || 'Ilham Sersa',
      photoURL: order.workerPhoto || '/assets/ilham.png',
      specialty: order.workerSpecialty || 'Spesialis teknisi panggilan',
      category: order.category,
      visitFee: order.visitFee || 50000,
    };
    toggleFavoriteWorker(workerObj);
    setIsFav(!isFav);
  };

  const visitFee = order?.visitFee || 55000;
  const repairFee = order?.repairFee || 150000;
  const total = visitFee + repairFee;

  const handlePay = async () => {
    setErrorMsg('');
    setLoadingPay(true);

    try {
      // Deduct the repair fee from Saku TULINE
      if (order?.paymentMethod === 'Saku TULINE' && !paid) {
        const balance = Number(currentUser?.walletBalance) || 0;
        if (balance < repairFee) {
          setErrorMsg(
            `Saldo Saku TULINE Anda (Rp ${balance.toLocaleString('id-ID')}) tidak mencukupi untuk melunasi biaya perbaikan Rp ${repairFee.toLocaleString('id-ID')}. Silakan Top Up terlebih dahulu.`
          );
          setTopUpOpen(true);
          return;
        }

        await deduct(repairFee);
      }

      if (order) {
        await updateOrderStatus(order.id, 'selesai', 6, { isPaid: true });
      }
      setPaid(true);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses pembayaran.');
    } finally {
      setLoadingPay(false);
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setRated(true);
    setShowThankYouModal(true);
  };

  return (
    <ResponsiveLayout
      pageTitle="Total Biaya Perbaikan"
      showBack
      onBack={() => navigate('/')}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full flex-1 flex flex-col gap-6">
        
        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setTopUpOpen(true)}
              className="px-3 py-1 bg-[#ff7f11] text-white font-bold rounded-lg shrink-0"
            >
              Top Up Sekarang
            </button>
          </div>
        )}

        {/* Thank You Badge & Title */}
        <div className="bg-[#ffde59] rounded-3xl p-6 shadow-sm border border-yellow-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-2 shadow-2xs ${
              paid ? 'bg-white/90 text-[#0c1b33]' : 'bg-[#ff7f11] text-white'
            }`}>
              {paid ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Pembayaran Lunas • Terima Kasih telah menggunakan jasa TULINE</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-white" />
                  <span>Status: Pembayaran (Menunggu Pelunasan)</span>
                </>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold font-jakarta text-[#0c1b33]">
              Rincian & Total Biaya Perbaikan
            </h1>
            <p className="text-xs sm:text-sm text-black/75 mt-0.5">
              Semua biaya transparan dan hanya berdasarkan pekerjaan yang disetujui.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-xs text-right self-start md:self-auto border border-black/5">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">
              Total Akhir
            </span>
            <span className="text-2xl font-extrabold text-[#ff7f11] font-jakarta">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Breakdown & Reviews (Desktop 2-columns / Mobile 1-column) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Cost Breakdown Card */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Rincian Pekerjaan
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  Teknisi: {order?.workerName || 'Ilham Sersa'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm py-1.5">
                <span className="text-gray-600">Biaya Kunjungan & Inspeksi Awal</span>
                <span className="font-bold text-black">
                  Rp {visitFee.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm py-1.5">
                <span className="text-gray-600">Jasa Servis & Penggantian Suku Cadang</span>
                <span className="font-bold text-black">
                  Rp {repairFee.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm py-1.5 text-emerald-600 font-semibold bg-emerald-50/70 p-2.5 rounded-xl">
                <span>Garansi Pekerjaan 30 Hari</span>
                <span className="flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aktif Otomatis</span>
                </span>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-black block">Total Pembayaran</span>
                  <span className="text-[11px] text-gray-500">Metode: {order?.paymentMethod || 'Saku TULINE'}</span>
                </div>
                <span className="text-2xl font-extrabold text-[#ff7f11] font-jakarta">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Payment Action */}
              <div className="pt-2">
                {!paid ? (
                  <button
                    onClick={handlePay}
                    disabled={loadingPay}
                    className="w-full h-12 bg-[#ff7f11] hover:bg-[#e06d0b] text-white font-extrabold text-sm rounded-full shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{loadingPay ? 'Memproses...' : 'Pelunasan dengan Saku TULINE'}</span>
                  </button>
                ) : (
                  <div className="bg-emerald-100 text-emerald-800 p-3.5 rounded-2xl text-center text-xs font-extrabold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Pembayaran Lunas & Bergaransi</span>
                  </div>
                )}
              </div>
              {/* Add to Favorite Technician from finished order */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-rose-500 shadow-xs flex items-center justify-center shrink-0">
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {isFav ? 'Teknisi Tersimpan di Favorit' : `Simpan ${order?.workerName || 'Teknisi'} ke Favorit?`}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {isFav ? 'Bisa langsung dipanggil lagi di tab Favorit.' : 'Memudahkan panggilan ulang berikutnya.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleFav}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isFav
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-[#ffde59] hover:bg-yellow-400 text-black'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  <span>{isFav ? 'Favorit' : '+ Favorit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Rating & Review */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200">
              <h3 className="text-sm font-extrabold text-black mb-2 flex items-center gap-1.5 font-jakarta">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Beri Rating dan Ulasan</span>
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Ulasan Anda sangat membantu teknisi kami meningkatkan kualitas pelayanan.
              </p>

              {!rated ? (
                <form onSubmit={handleRatingSubmit} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bagikan pengalaman servis Anda (misal: tepat waktu, rapi, ramah)..."
                    rows={3}
                    className="w-full p-3 bg-[#f7f5fb] rounded-2xl text-xs text-black border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff7f11] resize-none"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#ffde59] hover:bg-yellow-400 text-black text-xs font-bold rounded-full transition cursor-pointer"
                  >
                    Kirim Ulasan & Bintang
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-xs font-bold text-emerald-800">
                  Ulasan dan bintang telah berhasil disimpan!
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs rounded-full transition"
            >
              Kembali ke Halaman Beranda
            </button>
          </div>

        </div>

      </div>

      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />
    
      {/* Thank You Modal - Custom In-App (No browser alert) */}
      {showThankYouModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-yellow-200 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3.5 shadow-xs">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-extrabold font-jakarta text-[#0c1b33] mb-1">
              Terima Kasih Banyak!
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Penilaian dan ulasan Anda telah berhasil kami simpan dan teruskan langsung ke teknisi.
            </p>

            <div className="flex items-center gap-1 text-amber-400 mb-4 bg-amber-50 px-3 py-1.5 rounded-full">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= rating ? 'fill-current text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-amber-800 ml-1">{rating}.0</span>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowThankYouModal(false);
                  navigate('/');
                }}
                className="w-full py-2.5 bg-[#ff7f11] hover:bg-[#e06d0b] text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Kembali ke Beranda
              </button>
              <button
                type="button"
                onClick={() => setShowThankYouModal(false)}
                className="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                Tutup
              </button>
              {/* Add to Favorite Technician from finished order */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-rose-500 shadow-xs flex items-center justify-center shrink-0">
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {isFav ? 'Teknisi Tersimpan di Favorit' : `Simpan ${order?.workerName || 'Teknisi'} ke Favorit?`}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {isFav ? 'Bisa langsung dipanggil lagi di tab Favorit.' : 'Memudahkan panggilan ulang berikutnya.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleFav}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isFav
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-[#ffde59] hover:bg-yellow-400 text-black'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  <span>{isFav ? 'Favorit' : '+ Favorit'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}
