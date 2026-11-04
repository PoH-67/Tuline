import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { User, Mail, Lock, Check, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreePromo, setAgreePromo] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Mohon lengkapi semua kolom pendaftaran.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal terdiri dari 6 karakter.');
      return;
    }

    try {
      setLoading(true);
      await register(email, password, name);
      // Redirect to Login page with registered=true param so they must explicitly log in!
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout
      pageTitle="Daftar Akun Baru"
      showBack
      onBack={() => navigate('/login')}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#ffde59] rounded-3xl p-6 sm:p-8 shadow-xl border border-yellow-300 flex flex-col justify-between text-[#0c1b33]">
          
          {/* Top Header from Figma 1:368 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-xs flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <Link
                to="/login"
                className="text-[14px] font-bold text-[#030500] hover:text-[#ff7f11] transition"
              >
                Sudah punya akun? Login
              </Link>
            </div>

            <h1 className="text-[28px] font-extrabold font-jakarta text-center tracking-tight mt-1">
              Sign <span className="text-[#ff7f11]">UP</span>
            </h1>
            <p className="text-xs text-center text-black/70 mt-0.5">
              Buat akun baru untuk memesan teknisi ke rumah
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-700 px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full h-[50px] px-4 pl-11 bg-white/95 rounded-2xl border border-black/10 text-[14px] text-[#0c1b33] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7f11] shadow-xs"
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-[50px] px-4 pl-11 bg-white/95 rounded-2xl border border-black/10 text-[14px] text-[#0c1b33] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7f11] shadow-xs"
                required
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 karakter)"
                className="w-full h-[50px] px-4 pl-11 pr-16 bg-white/95 rounded-2xl border border-black/10 text-[14px] text-[#0c1b33] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7f11] shadow-xs"
                required
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 hover:text-black py-1 px-1.5"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Promotional Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer mt-1 select-none">
              <div
                onClick={() => setAgreePromo(!agreePromo)}
                className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                  agreePromo ? 'bg-[#ff7f11] border-[#ff7f11] text-white' : 'bg-white border-gray-400'
                }`}
              >
                {agreePromo && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-[11px] text-black/75 leading-tight">
                Saya bersedia menerima pembaruan layanan, promo diskon, dan informasi teknisi BENERIN.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] mt-2 bg-[#f7f5fb] text-[#0c1b33] font-extrabold text-[15px] rounded-full shadow-md hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer border border-black/5"
            >
              {loading ? 'Mendaftarkan Akun...' : 'Sign Up (Daftar)'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[13px] font-medium text-black/80">
              Sudah pernah mendaftar?{' '}
              <Link
                to="/login"
                className="font-extrabold text-[#0c1b33] hover:text-[#ff7f11] underline ml-1"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

        </div>
      </div>
    </ResponsiveLayout>
  );
}
