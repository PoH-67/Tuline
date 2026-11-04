import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TopUpModal from './TopUpModal';
import {
  Home,
  Heart,
  ClipboardList,
  Bell,
  User,
  ArrowLeft,
} from 'lucide-react';

export default function ResponsiveLayout({
  children,
  pageTitle,
  showBack = false,
  onBack,
  headerRight,
  hideTopNav = false,
  hideBottomNav = false,
  yellowHeader = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [topUpOpen, setTopUpOpen] = useState(false);

  const currentPath = location.pathname;

  // Exact 5 Navigation links matching Figma tabs: NO Cari Teknisi, NO Konsultasi AI
  const navLinks = [
    { label: 'Beranda', path: '/', icon: Home },
    { label: 'Favorit', path: '/favorit', icon: Heart },
    { label: 'Pesanan', path: '/pesanan', icon: ClipboardList },
    { label: 'Notifikasi', path: '/notifikasi', icon: Bell },
    { label: 'Profil', path: '/profil', icon: User },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#0c1b33] flex flex-col font-sans selection:bg-[#ff7f11] selection:text-white">
      
      {/* =========================================
          CASE A: ROOT TAB PAGES (hideTopNav = false)
          Desktop shows 5 tabs navbar. NO Back Button.
         ========================================= */}
      {!hideTopNav && (
        <header className="hidden md:block sticky top-0 z-40 bg-[#ffde59] border-b border-yellow-300 shadow-xs">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-xs flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="BENERIN"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="text-xl font-extrabold font-jakarta text-[#0c1b33] tracking-tight">
                BENER<span className="text-[#ff7f11]">IN</span>
              </span>
            </Link>

            {/* Desktop Navigation Links - Beranda, Favorit, Pesanan, Notifikasi, Profil */}
            <nav className="flex items-center gap-1.5 lg:gap-3">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPath === item.path ||
                  (item.path !== '/' && currentPath.startsWith(item.path));

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-[#0c1b33] shadow-xs'
                        : 'text-black/80 hover:bg-black/5 hover:text-black'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: User Profile or Login Button (NO wallet chip in navbar) */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <Link
                  to="/profil"
                  className="flex items-center gap-2.5 text-xs font-bold text-[#0c1b33] hover:text-[#ff7f11] transition bg-white/70 hover:bg-white px-3 py-1.5 rounded-full shadow-2xs border border-black/5"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-black/10">
                    <img
                      src="/assets/user-avatar.png"
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/assets/logo.png'; }}
                    />
                  </div>
                  <span>{currentUser.name?.split(' ')[0] || 'Profil'}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#0c1b33] text-white text-xs font-bold rounded-full hover:bg-black transition shadow-xs"
                >
                  Masuk
                </Link>
              )}
            </div>

          </div>
        </header>
      )}

      {/* =========================================
          CASE B: ACTION / SECONDARY PAGES (hideTopNav = true, showBack = true)
          Header with Back button on BOTH Desktop and Mobile! NO navbars.
         ========================================= */}
      {hideTopNav && (showBack || pageTitle) && (
        <header className="sticky top-0 z-40 bg-[#ffde59] border-b border-yellow-300 shadow-xs px-4 sm:px-6 h-14 sm:h-16 flex items-center">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-1.5 -ml-1.5 rounded-full text-[#0c1b33] hover:bg-black/10 active:scale-90 transition cursor-pointer flex items-center gap-1.5"
                  title="Kembali"
                >
                  <ArrowLeft className="w-5 h-5 font-bold" />
                  <span className="hidden sm:inline text-xs font-bold">Kembali</span>
                </button>
              )}

              {pageTitle && (
                <h1 className="text-sm sm:text-base font-extrabold font-jakarta text-[#0c1b33] truncate">
                  {pageTitle}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-2">
              {headerRight}
            </div>
          </div>
        </header>
      )}

      {/* =========================================
          MOBILE TOP NAVBAR KHUSUS BERANDA (Warna Kuning Web & Logo di Pojok Kiri)
         ========================================= */}
      {!hideTopNav && currentPath === '/' && (
        <header className="md:hidden sticky top-0 z-40 bg-[#ffde59] px-4 py-3 shadow-xs flex items-center justify-start border-b border-yellow-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white p-1 shadow-xs flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="BENERIN"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="text-lg font-extrabold font-jakarta text-[#0c1b33] tracking-tight">
              BENER<span className="text-[#ff7f11]">IN</span>
            </span>
          </div>
        </header>
      )}

      {/* =========================================
          MOBILE TOP HEADER FOR OTHER ROOT TABS (hideTopNav = false, NO BACK BUTTON)
         ========================================= */}
      {!hideTopNav && yellowHeader && pageTitle && currentPath !== '/' && (
        <div className="md:hidden sticky top-0 z-40 bg-[#ffde59] border-b border-yellow-300/40 px-4 pt-3.5 pb-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-jakarta text-[#0c1b33] truncate">
              {pageTitle}
            </h2>
            <div className="flex items-center gap-2">
              {headerRight}
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MAIN RESPONSIVE CONTENT AREA
          Generous margin/padding on ALL sides so content never touches screen edges or navbars!
         ========================================= */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        {children}
      </main>

      {/* =========================================
          MOBILE BOTTOM NAVBAR (Visible on root tabs, HIDDEN on action pages)
         ========================================= */}
      {!hideBottomNav && (
        <nav className="md:hidden sticky bottom-0 left-0 right-0 z-40 bg-[#ffde59] border-t border-yellow-300 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-3 pt-2 pb-4">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path !== '/' && currentPath.startsWith(item.path));

              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center px-2 py-0.5 relative transition-transform active:scale-95 cursor-pointer"
                >
                  {/* Active Indicator Bar */}
                  <span
                    className={`w-4 h-[3px] rounded-full mb-1 transition-all ${
                      isActive ? 'bg-[#ff7f11]' : 'opacity-0'
                    }`}
                  />
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#0c1b33] stroke-[2.4]' : 'text-black/55 stroke-[1.8]'
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-0.5 font-jakarta ${
                      isActive ? 'font-bold text-[#0c1b33]' : 'font-medium text-black/70'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Global Top Up Modal */}
      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} />

    </div>
  );
}
