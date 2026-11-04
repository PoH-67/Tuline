import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, ClipboardList, Bell, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const navItems = [
    { label: 'Beranda', path: '/', icon: Home },
    { label: 'Favorit', path: '/favorit', icon: Heart },
    { label: 'Pesanan', path: '/pesanan', icon: ClipboardList },
    { label: 'Notifikasi', path: '/notifikasi', icon: Bell },
    { label: 'Profil', path: '/profil', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-[#ffde59] rounded-t-[26px] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2 flex items-center justify-around border-t border-yellow-300/40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center py-1 px-2 relative transition-transform active:scale-95"
          >
            {/* Active Pill Indicator from Figma */}
            {isActive && (
              <span className="w-3.5 h-[3px] bg-[#ff7f11] rounded-full mb-1 transition-all" />
            )}
            {!isActive && <span className="w-3.5 h-[3px] opacity-0 mb-1" />}

            <Icon
              className={`w-5 h-5 transition-colors ${
                isActive ? 'text-[#0c1b33] stroke-[2.4]' : 'text-[#0c1b33]/60 stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[10px] mt-1 font-jakarta ${
                isActive ? 'font-bold text-[#0c1b33]' : 'font-medium text-[#0c1b33]/70'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
