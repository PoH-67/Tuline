import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import {
  ArrowLeft,
  Tv,
  Zap,
  Droplet,
  Armchair,
  Home as HomeIcon,
  Camera,
  Calendar,
  Clock,
  ChevronDown,
  Wallet,
  Plus,
  Wrench,
  AlertCircle,
} from 'lucide-react';

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const initialCat = searchParams.get('cat') || 'elektronik';

  const [activeTab, setActiveTab] = useState(initialCat);
  const [selectedSubCategory, setSelectedSubCategory] = useState('Kulkas & Pendingin');
  const [problemDetail, setProblemDetail] = useState('');
  
  // Alamat harus KOSONG awalnya (wajib diisi oleh pengguna)
  const [address, setAddress] = useState('');
  
  // Jadwal tanggal dan jam harus KOSONG awalnya (wajib dipilih oleh pengguna)
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  
  // Catatan tambahan opsional
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Saku BENERIN');
  
  // Foto unit WAJIB
  const [photoPreview, setPhotoPreview] = useState(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [formError, setFormError] = useState('');

  // Hitung Waktu Sekarang di zona WIB (UTC+7)
  const getWIBNow = () => {
    try {
      return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    } catch {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * 7);
    }
  };

  const wibNow = getWIBNow();
  const todayWIBStr = `${wibNow.getFullYear()}-${String(wibNow.getMonth() + 1).padStart(2, '0')}-${String(
    wibNow.getDate()
  ).padStart(2, '0')}`;
  const currentWIBHour = wibNow.getHours();

  const ALL_TIME_SLOTS = [
    { label: '08:00 - 10:00', endHour: 10 },
    { label: '10:00 - 12:00', endHour: 12 },
    { label: '13:00 - 15:00', endHour: 15 },
    { label: '15:00 - 17:00', endHour: 17 },
    { label: '17:00 - 19:00', endHour: 19 },
    { label: '19:00 - 21:00', endHour: 21 },
  ];

  // Filter slot jam jika tanggal yang dipilih adalah hari ini
  const isSelectedToday = visitDate === todayWIBStr;
  const availableTimeSlots = isSelectedToday
    ? ALL_TIME_SLOTS.filter((slot) => slot.endHour > currentWIBHour)
    : ALL_TIME_SLOTS;

  useEffect(() => {
    const queryProblem = searchParams.get('problem');
    const querySub = searchParams.get('sub');
    if (queryProblem) setProblemDetail(queryProblem);
    if (querySub) setSelectedSubCategory(querySub);
  }, [searchParams]);

  const categories = [
    { id: 'elektronik', name: 'Perangkat Elektronik', icon: Tv },
    { id: 'listrik', name: 'Listrik Bangunan', icon: Zap },
    { id: 'ledeng', name: 'Ledeng', icon: Droplet },
    { id: 'furnitur', name: 'Furnitur', icon: Armchair },
    { id: 'sipil', name: 'Sipil & Bangunan', icon: HomeIcon },
  ];

  const subCategories = {
    elektronik: ['Kulkas & Pendingin', 'Air Conditioner (AC)', 'Mesin Cuci', 'TV & Audio', 'Kipas Angin', 'Microwave & Oven'],
    listrik: ['Instalasi Stop Kontak', 'MCB / Sekring Sering Turun', 'Jalur Kabel Korslet', 'Pemasangan Titik Lampu', 'Penyeimbangan Daya'],
    ledeng: ['Pipa Bocor / Rembes', 'Wastafel / Kloset Mampet', 'Pompa Air & Toren', 'Ganti Kran & Pipa', 'Water Heater'],
    furnitur: ['Reparasi Engsel & Lemari', 'Kitchen Set Kayu', 'Meja & Kursi Patah', 'Cat Ulang & Pernis', 'Bongkar Pasang Mebel'],
    sipil: ['Atap / Genteng Bocor', 'Plamir & Cat Dinding Retak', 'Pasang Keramik Lantai', 'Plafon Rusak / Jebol', 'Partisi Ruangan'],
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setFormError('');
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    setFormError('');

    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk memesan teknisi!');
      navigate('/login');
      return;
    }

    // 1. Validasi Detail Masalah (Wajib)
    if (!problemDetail.trim()) {
      setFormError('Mohon isi detail masalah kerusakan unit terlebih dahulu.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validasi Foto Unit (Wajib)
    if (!photoPreview) {
      setFormError('Foto unit kerusakan wajib diunggah.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Validasi Alamat (Wajib)
    if (!address.trim()) {
      setFormError('Alamat lengkap kunjungan wajib diisi.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Validasi Tanggal Kunjungan (Wajib)
    if (!visitDate) {
      setFormError('Silakan pilih tanggal kunjungan terlebih dahulu.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 5. Validasi Jam Kunjungan (Wajib)
    if (!visitTime) {
      setFormError('Silakan pilih jam kunjungan teknisi.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const params = new URLSearchParams({
      cat: activeTab,
      sub: selectedSubCategory,
      problem: problemDetail,
      address,
      date: visitDate,
      time: visitTime,
      notes,
      payment: paymentMethod,
    });

    setIsSearching(true);
    setTimeout(() => {
      navigate(`/teknisi?${params.toString()}`);
    }, 2500);
  };

  return (
    <ResponsiveLayout
      pageTitle="Pesan Jasa Servis"
      showBack
      onBack={() => navigate('/')}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full flex-1 flex flex-col gap-6">
        
        {/* Category Header Pills (Desktop & Mobile) */}
        <div className="bg-[#ffde59] rounded-3xl p-5 shadow-sm border border-yellow-300">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg md:text-xl font-extrabold font-jakarta text-[#0c1b33]">
              Pilih Kategori Layanan
            </h1>
            <span className="text-xs font-bold text-black/70">
              Teknisi Bersertifikat Siap Dipanggil
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat.id);
                    setSelectedSubCategory(subCategories[cat.id][0]);
                  }}
                  className={`flex items-center sm:flex-col justify-start sm:justify-center p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-[#e95322] shadow-sm scale-102'
                      : 'bg-white/70 hover:bg-white border border-transparent'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mr-2.5 sm:mr-0 ${
                      isSelected ? 'bg-orange-100 text-[#e95322]' : 'text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs mt-0 sm:mt-1.5 text-left sm:text-center leading-tight ${
                      isSelected ? 'font-bold text-[#e95322]' : 'font-medium text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error Banner */}
        {formError && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Booking Form (2 Columns on Desktop) */}
        <form
          onSubmit={handleProceed}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200 flex flex-col gap-5 text-[#0c1b33]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Left Column: Problem & Category */}
            <div className="flex flex-col gap-4">
              
              {/* Sub-Category Selection */}
              <div>
                <label className="text-xs font-bold text-black block mb-1.5">
                  Sub-Kategori Masalah <span className="text-[#e95322]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full h-11 px-4 bg-[#f8f9fe] border-2 border-black/10 rounded-2xl text-xs sm:text-sm font-semibold text-black focus:outline-none focus:border-[#e95322] appearance-none"
                  >
                    {subCategories[activeTab]?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Detail Masalah & Foto Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-black">
                    Detail Masalah Kerusakan <span className="text-[#e95322]">*</span>
                  </label>
                  <label className="text-xs font-bold text-black">
                    Foto Unit <span className="text-[#e95322]">* Wajib</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      value={problemDetail}
                      onChange={(e) => {
                        setProblemDetail(e.target.value);
                        if (formError) setFormError('');
                      }}
                      placeholder="Contoh: freezer kulkas tidak dingin, kipas angin tidak berputar, ada bunyi mendengung..."
                      rows={3}
                      className="w-full p-3 bg-[#f7f5fb] rounded-2xl text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e95322] resize-none border border-gray-200"
                    />
                  </div>

                  {/* Photo Upload Box (Wajib) */}
                  <label className={`w-24 h-[86px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition shrink-0 relative overflow-hidden ${
                    photoPreview ? 'border-emerald-400 bg-emerald-50/30' : 'border-[#e95322]/40 bg-[#fff5ee] hover:bg-orange-50'
                  }`}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-[#e95322]" />
                        <span className="text-[10px] text-[#e95322] mt-1 font-bold">Wajib Foto</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Catatan Tambahan (Opsional) */}
              <div>
                <label className="text-xs font-bold text-black block mb-1.5">
                  Catatan Tambahan <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Rumah pagar hitam samping musholla, tolong bawa obeng khusus"
                  className="w-full h-11 px-4 bg-[#f7f5fb] rounded-2xl text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e95322] border border-gray-200"
                />
              </div>
            </div>

            {/* Right Column: Address, Date & Payment */}
            <div className="flex flex-col gap-4">
              {/* Alamat Kunjungan (Default Kosong, Wajib Diisi) */}
              <div>
                <label className="text-xs font-bold text-black block mb-1.5">
                  Alamat Lengkap Kunjungan <span className="text-[#e95322]">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Masukkan alamat lengkap rumah/lokasi perbaikan Anda..."
                  className="w-full h-11 px-4 bg-[#f7f5fb] rounded-2xl text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e95322] border border-gray-200"
                />
              </div>

              {/* Jadwal Kunjungan: Tanggal & Jam (Timeline WIB +7, Wajib Diisi) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-black">
                    Jadwal Kunjungan Teknisi (WIB +7) <span className="text-[#e95322]">*</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Zona Waktu: WIB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Tanggal Picker: Minimal hari ini (tidak bisa pilih yang sudah lewat) */}
                  <div className="bg-[#f7f5fb] border border-gray-200 rounded-2xl p-2.5 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#e95322] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-gray-500 block leading-tight font-bold">
                        Pilih Tanggal <span className="text-[#e95322]">*</span>
                      </span>
                      <input
                        type="date"
                        min={todayWIBStr}
                        value={visitDate}
                        onChange={(e) => {
                          setVisitDate(e.target.value);
                          setVisitTime('');
                          if (formError) setFormError('');
                        }}
                        className="w-full bg-transparent text-xs font-bold text-black focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Jam Picker: Otomatis menyaring jam yang sudah lewat jika tanggalnya hari ini */}
                  <div className="bg-[#f7f5fb] border border-gray-200 rounded-2xl p-2.5 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#e95322] shrink-0" />
                    <div className="flex-1 min-w-0 relative">
                      <span className="text-[9px] text-gray-500 block leading-tight font-bold">
                        Pilih Jam <span className="text-[#e95322]">*</span>
                      </span>
                      <select
                        value={visitTime}
                        onChange={(e) => {
                          setVisitTime(e.target.value);
                          if (formError) setFormError('');
                        }}
                        disabled={!visitDate}
                        className="w-full bg-transparent text-xs font-bold text-black focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">{visitDate ? '-- Pilih Jam --' : 'Pilih Tanggal Dulu'}</option>
                        {availableTimeSlots.map((slot) => (
                          <option key={slot.label} value={slot.label}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-0 top-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Notice jika hari ini semua slot sudah lewat */}
                {isSelectedToday && availableTimeSlots.length === 0 && (
                  <p className="text-[11px] text-red-600 mt-2 font-medium">
                    ⚠️ Semua jam kunjungan untuk hari ini telah lewat. Silakan pilih tanggal besok atau berikutnya.
                  </p>
                )}
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="text-xs font-bold text-black block mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="bg-[#fff9e6] border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#ffde59] flex items-center justify-center text-[#ff7f11]">
                      <Wallet className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-black block leading-tight">
                        Saku BENER<span className="text-[#ff7f11]">IN</span>
                      </span>
                      <span className="text-[11px] text-gray-600">
                        Saldo: Rp {(currentUser?.walletBalance || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTopUpOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#ff7f11] bg-white px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-orange-50 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Top Up</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto md:min-w-[280px] h-12 bg-[#ffde59] hover:bg-yellow-400 text-black font-extrabold text-sm rounded-full shadow-md active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer border border-black/5"
            >
              <span>Cari Teknisi Siap Berangkat</span>
              <span className="text-sm">→</span>
            </button>
          </div>
        </form>

      </div>

      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />
    
      {/* Loading Overlay "Mencari teknisi..." */}
      {isSearching && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-yellow-200 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Animated Radar Pulse */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-5">
              <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
              <span className="absolute inset-2 rounded-full bg-[#ffde59]/50 animate-pulse" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#ffde59] shadow-md flex items-center justify-center text-[#ff7f11]">
                <Wrench className="w-9 h-9 animate-bounce" />
              </div>
            </div>

            <h3 className="text-xl font-extrabold font-jakarta text-[#0c1b33] mb-1.5">
              Mencari teknisi...
            </h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[260px]">
              Menghubungkan ke teknisi siap berangkat terdekat di area lokasi Anda...
            </p>

            <div className="flex items-center gap-2 mt-5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff7f11] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff7f11] animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff7f11] animate-bounce"></span>
            </div>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}
