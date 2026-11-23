import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { Bell, Sparkles, CheckCircle2, Tag } from 'lucide-react';

export default function NotificationsPage() {
  const navigate = useNavigate();

  const notifs = [
    {
      id: 1,
      title: 'Teknisi Menuju Lokasi Anda',
      desc: 'Ilham Sersa sedang dalam perjalanan menuju rumah Anda. Estimasi tiba 25 menit.',
      time: '10 menit lalu',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 2,
      title: 'Top Up Saku TULINE Berhasil',
      desc: 'Saldo Saku TULINE Anda telah bertambah dan siap digunakan untuk pemesanan teknisi.',
      time: '30 menit lalu',
      icon: Tag,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      id: 3,
      title: 'Konsultasi Kerusakan dengan AI Tuline',
      desc: 'Tanyakan estimasi biaya dan diagnosa awal gratis sebelum memesan teknisi ke rumah.',
      time: 'Kemarin',
      icon: Sparkles,
      color: 'text-amber-600 bg-yellow-50',
    },
  ];

  return (
    <ResponsiveLayout pageTitle="Notifikasi" showBack={false}>
      <div className="w-full flex-1 flex flex-col gap-6">
        
        <div className="bg-[#ffde59] rounded-3xl p-5 md:p-6 shadow-sm border border-yellow-300 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold font-jakarta text-[#0c1b33]">
              Pemberitahuan & Notifikasi
            </h1>
            <p className="text-xs sm:text-sm text-black/75 mt-0.5">
              Info perjalanan teknisi, pembaruan saldo, dan promo servis terbaru.
            </p>
          </div>
          <Bell className="w-6 h-6 text-black/75 shrink-0" />
        </div>

        <div className="flex flex-col gap-3">
          {notifs.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-2xs hover:shadow-xs transition flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-black">{n.title}</h3>
                    <span className="text-[11px] text-gray-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </ResponsiveLayout>
  );
}
