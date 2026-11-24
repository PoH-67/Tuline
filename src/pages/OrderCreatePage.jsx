import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import { ChevronDown, AlertCircle, X } from 'lucide-react';

import iconElektronik from '../assets/figma_icons/cat_elektronik.svg';
import iconListrik from '../assets/figma_icons/cat_listrik.svg';
import iconLedeng from '../assets/figma_icons/cat_ledeng.svg';
import iconFurnitur from '../assets/figma_icons/cat_furnitur.svg';
import iconSipil from '../assets/figma_icons/cat_sipil.svg';

import iconPhotoDoc from '../assets/figma_icons/icon_photo_doc.svg';
import iconCalendarPin from '../assets/figma_icons/icon_calendar_pin.svg';
import iconClock from '../assets/figma_icons/icon_clock.svg';
import iconArrowCircle from '../assets/figma_icons/icon_arrow_circle.svg';
import iconBackArrow from '../assets/figma_icons/icon_back_arrow.svg';

// Definisi Kategori dan Sub-Kategori Eksklusif per Halaman
// Reparasi -> Cuma Perangkat Elektronik & Furnitur
// Instalasi -> Cuma Listrik Bangunan & Ledeng
// Renovasi  -> Cuma Sipil & Bangunan
export const ACTION_SERVICES = {
  reparasi: {
    actionKey: 'reparasi',
    title: 'Reparasi',
    defaultCat: 'elektronik',
    placeholder: 'Contoh: freezer kulkas sudah tidak dingin, Kipas angin tidak berputar.',
    allowedCategories: [
      { id: 'elektronik', name: 'Perangkat Elektronik', icon: iconElektronik },
      { id: 'furnitur', name: 'Furnitur', icon: iconFurnitur },
    ],
    categories: {
      elektronik: [
        'Kulkas & Pendingin',
        'Air Conditioner (AC)',
        'Mesin Cuci',
        'TV & Audio',
        'Kipas Angin',
        'Microwave & Oven',
      ],
      furnitur: [
        'Reparasi Engsel & Rel Laci',
        'Meja & Kursi Patah / Goyang',
        'Kunci Pintu & Grendel Rusak',
        'Cat Ulang / Pernis Furnitur',
        'Perbaikan Kitchen Set Kayu',
      ],
    },
  },
  instalasi: {
    actionKey: 'instalasi',
    title: 'Instalasi',
    defaultCat: 'listrik',
    placeholder: 'Contoh: pasang stopkontak di dapur, pasang pipa air baru.',
    allowedCategories: [
      { id: 'listrik', name: 'Listrik Bangunan', icon: iconListrik },
      { id: 'ledeng', name: 'Ledeng', icon: iconLedeng },
    ],
    categories: {
      listrik: [
        'Pasang Titik Lampu & Stop Kontak',
        'Pasang Box Panel MCB & Sekring',
        'Instalasi Grounding & Penangkal Petir',
        'Pasang Saklar Otomatis / Smart Home',
        'Penarikan Jalur Kabel Baru',
      ],
      ledeng: [
        'Instalasi Pipa Air Bersih / Kotor',
        'Pasang Toren Air & Otomatis Pelampung',
        'Pasang Kloset Duduk / Jongkok Baru',
        'Pasang Wastafel, Bak Cuci & Shower',
        'Pasang Kran & Filter Air',
      ],
    },
  },
  renovasi: {
    actionKey: 'renovasi',
    title: 'Renovasi',
    defaultCat: 'sipil',
    placeholder: 'Contoh: ganti keramik kamar mandi 2x2 meter, cat ulang dinding ruang tamu.',
    allowedCategories: [
      { id: 'sipil', name: 'Sipil & Bangunan', icon: iconSipil },
    ],
    categories: {
      sipil: [
        'Renovasi Kamar Mandi & Toilet',
        'Pengecatan Ulang Dinding & Plafon',
        'Renovasi Atap Dak Beton & Waterproofing',
        'Bongkar & Pasang Lantai Granit / Keramik',
        'Perombakan Plafon Gypsum & Drop Ceiling',
        'Pasang Partisi Gypsum / Sekat Ruangan',
      ],
    },
  },
};

export default function OrderCreatePage({ defaultAction }) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  // Tentukan Action Type: dari prop defaultAction, atau route param :actionType, atau query ?action=
  const actionFromRoute = params.actionType;
  const actionFromQuery = searchParams.get('action');
  const actionKey = (defaultAction || actionFromRoute || actionFromQuery || 'reparasi').toLowerCase();

  const currentActionConfig = ACTION_SERVICES[actionKey] || ACTION_SERVICES.reparasi;

  // Pastikan kategori awal adalah salah satu dari allowedCategories halaman ini
  const queryCat = searchParams.get('cat');
  const isQueryCatAllowed = currentActionConfig.allowedCategories.some((c) => c.id === queryCat);
  const initialCat = isQueryCatAllowed ? queryCat : currentActionConfig.defaultCat;

  const [activeCategory, setActiveCategory] = useState(initialCat);

  // Subkategori terpilih di dropdown
  const availableSubCategories = currentActionConfig.categories[activeCategory] || [];
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    searchParams.get('sub') || availableSubCategories[0] || ''
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Detail Masalah
  const [problemDetail, setProblemDetail] = useState(searchParams.get('problem') || '');
  
  // Alamat harus KOSONG awalnya (wajib diisi oleh pengguna)
  const [address, setAddress] = useState('');
  
  // Jadwal tanggal dan jam harus KOSONG awalnya (wajib dipilih oleh pengguna)
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  
  // Catatan tambahan opsional
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Saku TULINE');
  
  // Foto unit WAJIB
  const [photoPreview, setPhotoPreview] = useState(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [formError, setFormError] = useState('');

  // Saat actionKey atau kategori berubah, reset subkategori ke item pertama kategori terkait
  useEffect(() => {
    // Validasi apakah activeCategory masih valid di halaman ini
    const isCatValid = currentActionConfig.allowedCategories.some((c) => c.id === activeCategory);
    if (!isCatValid) {
      setActiveCategory(currentActionConfig.defaultCat);
      return;
    }

    const subs = currentActionConfig.categories[activeCategory] || [];
    if (subs.length > 0 && !subs.includes(selectedSubCategory)) {
      setSelectedSubCategory(subs[0]);
    }
  }, [actionKey, activeCategory, currentActionConfig]);

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
      setFormError('Mohon isi detail masalah terlebih dahulu.');
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
      setFormError('Silakan pilih jam kunjungan.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Menuju Halaman Pencarian / Matching Teknisi dengan parameter lengkap
    const params = new URLSearchParams({
      action: actionKey,
      cat: activeCategory,
      sub: selectedSubCategory,
      problem: problemDetail,
      address,
      date: visitDate,
      time: visitTime,
      notes,
      payment: paymentMethod,
    });

    navigate(`/teknisi?${params.toString()}`);
  };

  return (
    <ResponsiveLayout
      hideTopNav
      hideBottomNav
      noHeader
      noPadding
    >
      <div className="w-full min-h-screen bg-white flex flex-col pb-8">
        
        {/* =========================================
            HEADER KUNING (Sesuai Desain Figma Gambar 2)
            Lebar full sampai ujung layar, hanya tombol panah merah/oranye di pojok kiri atas
           ========================================= */}
        <section className="w-full bg-[#ffde59] pt-4 pb-6 px-4 border-b border-yellow-300">
          <div className="w-full max-w-md mx-auto">
            {/* Top Row: Tombol kembali panah tunggal tanpa teks */}
            <div className="flex items-center mb-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="p-1 -ml-1 text-[#ff7f11] hover:opacity-80 active:scale-95 transition cursor-pointer"
                aria-label="Kembali"
              >
                <img src={iconBackArrow} alt="Kembali" className="w-3 h-4 object-contain" />
              </button>
            </div>

            {/* Category Icons Row Eksklusif untuk Halaman ini */}
            <div className="flex items-center justify-center gap-8 sm:gap-14">
              {currentActionConfig.allowedCategories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsDropdownOpen(false);
                    }}
                    className="flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div
                      className={`w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-[14px] flex items-center justify-center p-2 transition ${
                        isSelected
                          ? 'bg-[#f0f0f0] border-2 border-[#e95322] shadow-xs'
                          : 'bg-[#f0f0f0] border-2 border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] mt-1.5 leading-tight tracking-tight max-w-[80px] ${
                        isSelected ? 'font-bold text-[#c40000]' : 'font-medium text-[#030303]'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================
            FORM BODY (Sesuai Desain Figma Gambar 1)
           ========================================= */}
        <div className="w-full flex-1 bg-white">
          <form onSubmit={handleProceed} className="w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
          
          {/* Error Banner jika form belum lengkap */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. KATEGORI (DROPDOWN) */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-black mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-[40px] bg-white border-2 border-black/80 rounded-[15px] px-4 flex items-center justify-between text-left text-[11px] text-black font-medium focus:outline-none focus:ring-1 focus:ring-[#ff7f11] cursor-pointer"
            >
              <span>{selectedSubCategory || 'pilih'}</span>
              <ChevronDown className={`w-4 h-4 text-black transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-[62px] left-0 right-0 bg-white border-2 border-black/80 rounded-[15px] shadow-lg z-30 max-h-56 overflow-y-auto overflow-hidden divide-y divide-gray-100">
                {availableSubCategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setSelectedSubCategory(sub);
                      setIsDropdownOpen(false);
                      setFormError('');
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-orange-50 transition cursor-pointer ${
                      selectedSubCategory === sub ? 'text-[#ff7f11] bg-orange-50/60' : 'text-black'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. FOTO (Kiri) & DETAIL MASALAH (Kanan) Side by Side */}
          <div className="flex items-start gap-3">
            
            {/* Foto (Wajib) */}
            <div className="w-[71px] shrink-0">
              <label className="block text-[11px] font-bold text-black mb-1">
                Foto <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  id="photo-upload-input"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {photoPreview ? (
                  <div className="w-[71px] h-[71px] rounded-[10px] overflow-hidden border border-gray-300 relative group">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-80 group-hover:opacity-100"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="photo-upload-input"
                    className="w-[71px] h-[71px] bg-[#f0f0f0] rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                  >
                    <img src={iconPhotoDoc} alt="Upload Foto" className="w-6 h-7 object-contain opacity-80" />
                  </label>
                )}
              </div>
            </div>

            {/* Detail Masalah (Wajib) */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-black mb-1">
                Detail Masalah <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={problemDetail}
                onChange={(e) => {
                  setProblemDetail(e.target.value);
                  setFormError('');
                }}
                placeholder={currentActionConfig.placeholder}
                className="w-full h-[71px] bg-[#f0f0f0] rounded-[10px] p-2.5 text-[11px] text-black placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#ff7f11]"
              />
            </div>

          </div>

          {/* 3. ALAMAT LENGKAP (Wajib) */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1">
              Alamat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setFormError('');
              }}
              placeholder="Contoh: Jalan Haji Hasanudin, Rt 01 Rw 02 No 7, Pondok Petir, depok."
              className="w-full h-[39px] bg-[#f0f0f0] rounded-[10px] px-3 text-[11px] text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#ff7f11]"
            />
          </div>

          {/* 4. JADWAL KUNJUNGAN (Wajib) */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1">
              Jadwal Kunjungan <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              
              {/* Tanggal */}
              <div className="bg-[#f0f0f0] rounded-[10px] h-[45px] px-2.5 py-1 flex flex-col justify-center relative">
                <span className="text-[10px] text-[#3a3a3a] leading-none mb-0.5">Tanggal</span>
                <div className="flex items-center gap-1.5">
                  <img src={iconCalendarPin} alt="Calendar" className="w-3.5 h-3.5 object-contain shrink-0" />
                  <input
                    type="date"
                    min={todayWIBStr}
                    value={visitDate}
                    onChange={(e) => {
                      setVisitDate(e.target.value);
                      setVisitTime('');
                      setFormError('');
                    }}
                    className="w-full bg-transparent text-[10px] font-medium text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Jam */}
              <div className="bg-[#f0f0f0] rounded-[10px] h-[45px] px-2.5 py-1 flex flex-col justify-center relative">
                <span className="text-[10px] text-[#3a3a3a] leading-none mb-0.5">Jam</span>
                <div className="flex items-center gap-1.5">
                  <img src={iconClock} alt="Clock" className="w-3.5 h-3.5 object-contain shrink-0" />
                  <select
                    value={visitTime}
                    onChange={(e) => {
                      setVisitTime(e.target.value);
                      setFormError('');
                    }}
                    disabled={!visitDate}
                    className="w-full bg-transparent text-[10px] font-medium text-black focus:outline-none cursor-pointer"
                  >
                    <option value="">{visitDate ? 'Pilih Jam' : 'Pilih Tanggal Dulu'}</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot.label} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* 5. CATATAN TAMBAHAN (Opsional) */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1">
              Catatan Tambahan
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahan yang membantu. Contoh: patokan rumah (cat,pagar), Kipas bunyi namun tidak berputar, baut hilang."
              className="w-full h-[54px] bg-[#f0f0f0] rounded-[5px] px-3 text-[11px] text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#ff7f11]"
            />
          </div>

          {/* 6. METODE PEMBAYARAN */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1">
              Metode Pembayaran
            </label>
            <div className="w-full h-[54px] bg-[#f0f0f0] rounded-[5px] px-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold font-jakarta text-black">
                  Saku TU<span className="text-[#ff7f11]">LINE</span>
                </span>
              </div>
              <div className="text-right text-[11px] text-black/70 leading-tight">
                <p>Tersedia di saku:</p>
                <p className="font-bold text-black">
                  Rp {(currentUser?.walletBalance || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* 7. TOMBOL "CARI TEKNISI" */}
          <button
            type="submit"
            className="w-full h-[49px] bg-[#ffde59] hover:bg-[#ebce4b] rounded-[5px] flex items-center justify-center relative shadow-sm cursor-pointer active:scale-[0.99] transition mt-2 border border-yellow-400"
          >
            <span className="font-serif text-lg font-bold text-black tracking-wide">
              Cari Teknisi
            </span>
            <img
              src={iconArrowCircle}
              alt="Arrow"
              className="w-5 h-5 absolute right-4 object-contain"
            />
          </button>

        </form>
        </div>

      </div>

      {/* Top Up Modal jika dibutuhkan */}
      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </ResponsiveLayout>
  );
}
