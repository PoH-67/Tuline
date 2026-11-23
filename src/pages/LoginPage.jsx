import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('Pendaftaran akun berhasil! Silakan masuk dengan email dan password yang baru Anda buat.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Mohon isi email dan password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Successfully logged in
      navigate('/');
    } catch (err) {
      setError(
        err.message || 'Akun tidak ditemukan atau password salah. Pastikan Anda telah membuat akun melalui Sign Up.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout hideTopNav hideBottomNav showBack={false}>
      <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#ffde59] rounded-3xl p-6 sm:p-8 shadow-xl border border-yellow-300 flex flex-col justify-between text-[#0c1b33]">
          
          {/* Top Header & Logo */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-xs flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="TULINE Logo"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <h1 className="text-[26px] font-extrabold font-jakarta text-center mt-3 tracking-tight">
              Sign in TUL<span className="text-[#ff7f11]">INE</span>
            </h1>
            <p className="text-[13px] font-semibold text-black/75 text-center mt-0.5">
              Semua Urusan Tukang, Tinggal Online!
            </p>
          </div>

          {/* Success Banner when just registered */}
          {successMsg && (
            <div className="mt-4 bg-emerald-100 border border-emerald-400 text-emerald-800 px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-700 px-3.5 py-2.5 rounded-2xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Akun"
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
                placeholder="Password"
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => alert('Fitur reset password telah dikirim ke email Anda.')}
                className="text-[12px] font-semibold text-black/75 hover:text-black hover:underline"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] mt-2 bg-[#f7f5fb] text-[#0c1b33] font-extrabold text-[15px] rounded-full shadow-md hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer border border-black/5"
            >
              {loading ? 'Memeriksa Akun...' : 'Log In (Masuk)'}
            </button>
          </form>

          {/* Footer Navigation to Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-[13px] font-medium text-black/80">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="font-extrabold text-[#0c1b33] hover:text-[#ff7f11] underline ml-1"
              >
                Buat Akun Baru (Sign Up)
              </Link>
            </p>
          </div>

        </div>
      </div>
    </ResponsiveLayout>
  );
}
