import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import TopUpModal from '../components/TopUpModal';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Package,
  HelpCircle,
  ChevronRight,
  LogOut,
  Edit2,
  Wallet,
  Plus,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  if (!currentUser) {
    return (
      <ResponsiveLayout pageTitle="Profil Saya" showBack={false}>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Anda Belum Masuk</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Masuk atau buat akun baru untuk mengakses profil dan riwayat pesanan Anda.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-[#ffde59] text-black font-extrabold text-xs rounded-full shadow-xs"
            >
              Masuk (Login)
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-white text-black font-extrabold text-xs rounded-full border border-gray-300"
            >
              Daftar (Sign Up)
            </Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ name, address, phone });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun ini?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <ResponsiveLayout pageTitle="Profil Saya" showBack={false}>
      <div className="w-full flex-1 flex flex-col gap-6">
        
        {/* Profile Header Card */}
        <div className="bg-[#ffde59] rounded-3xl p-6 shadow-sm border border-yellow-300 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-white shrink-0">
            <img
              src="/assets/user-avatar.png"
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/assets/logo.png'; }}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold font-jakarta text-[#0c1b33]">
                {currentUser.name}
              </h1>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <p className="text-xs text-black/70 font-semibold mt-0.5">
              {currentUser.email}
            </p>

            {/* Wallet Balance Pill */}
            <div className="mt-3 inline-flex items-center gap-3 bg-white/95 px-4 py-2 rounded-2xl shadow-2xs border border-black/5">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#ff7f11]" />
                <span className="text-xs font-semibold text-gray-500">Saldo:</span>
                <span className="text-sm font-extrabold text-[#0c1b33] font-jakarta">
                  Rp {(currentUser.walletBalance || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTopUpOpen(true)}
                className="px-2.5 py-1 bg-[#ff7f11] hover:bg-[#e06d0b] text-white text-[11px] font-bold rounded-lg transition"
              >
                Top Up
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details & Settings (2-Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Information Fields */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-black font-jakarta">
                  Data Informasi Pribadi
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-[#ff7f11] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Batal' : 'Edit'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#f7f5fb] rounded-xl text-xs sm:text-sm font-semibold text-black border border-gray-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#f7f5fb] rounded-xl text-xs sm:text-sm font-semibold text-black border border-gray-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Alamat Utama</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#f7f5fb] rounded-xl text-xs sm:text-sm font-semibold text-black border border-gray-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#ff7f11] text-white text-xs font-bold rounded-full mt-2 shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block">Nama Pengguna</span>
                    <div className="bg-[#ffde59]/70 px-4 py-2.5 rounded-2xl font-bold text-sm text-[#391713] mt-1">
                      {currentUser.name}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block">Alamat Kunjungan</span>
                    <div className="bg-[#ffde59]/70 px-4 py-2.5 rounded-2xl font-medium text-xs sm:text-sm text-[#391713] mt-1 leading-snug">
                      {currentUser.address}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block">Email Terdaftar</span>
                    <div className="bg-[#ffde59]/70 px-4 py-2.5 rounded-2xl font-medium text-xs sm:text-sm text-[#391713] mt-1">
                      {currentUser.email}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block">Nomor Telepon</span>
                    <div className="bg-[#ffde59]/70 px-4 py-2.5 rounded-2xl font-medium text-xs sm:text-sm text-[#391713] mt-1">
                      {currentUser.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Links & Logout */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 flex flex-col divide-y divide-gray-100">
              <button
                onClick={() => navigate('/pesanan')}
                className="flex items-center justify-between py-3 text-xs sm:text-sm font-bold text-[#0c1b33] hover:text-[#ff7f11] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ff7f11] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span>Riwayat Semua Pesanan</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => alert('Pusat Bantuan TULINE: Silakan hubungi CS WhatsApp di 0812-3456-7890.')}
                className="flex items-center justify-between py-3 text-xs sm:text-sm font-bold text-[#0c1b33] hover:text-[#ff7f11] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span>Pusat Bantuan & FAQ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 text-xs sm:text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>

        </div>

      </div>

      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </ResponsiveLayout>
  );
}
