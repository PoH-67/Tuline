import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Wallet, Check, Sparkles, QrCode, CreditCard } from 'lucide-react';

export default function TopUpModal({ isOpen, onClose }) {
  const { currentUser, topUp } = useAuth();

  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentChannel, setPaymentChannel] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addedAmount, setAddedAmount] = useState(0);

  if (!isOpen) return null;

  const amounts = [20000, 50000, 100000, 200000, 500000];

  const handleSelectPredefined = (val) => {
    setSelectedAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setSelectedAmount(Number(val) || 0);
  };

  const currentWallet = currentUser?.walletBalance || 0;
  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const previewTotal = currentWallet + effectiveAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 10000) {
      alert('Nominal Top Up minimal Rp 10.000.');
      return;
    }

    try {
      setLoading(true);
      await topUp(effectiveAmount);
      setAddedAmount(effectiveAmount);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Gagal melakukan Top Up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ffde59] flex items-center justify-center text-[#ff7f11]">
              <Wallet className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-jakarta">
                Top Up Saku BENER<span className="text-[#ff7f11]">IN</span>
              </h3>
              <p className="text-[11px] text-gray-500">Saldo Anda: Rp {currentWallet.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-lg font-extrabold text-gray-900">Top Up Berhasil!</h4>
            <p className="text-sm text-gray-600 mt-1">
              Saldo bertambah <span className="font-bold text-emerald-600">+Rp {addedAmount.toLocaleString('id-ID')}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            
            {/* Quick Amount Buttons */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">
                Pilih Nominal Top Up
              </label>
              <div className="grid grid-cols-3 gap-2">
                {amounts.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPredefined(amt)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-extrabold transition-all border ${
                        isSelected
                          ? 'bg-[#ffde59] text-black border-amber-400 shadow-sm scale-102 ring-2 ring-[#ff7f11]/30'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Atau Masukkan Nominal Lain (Rp)
              </label>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="Contoh: 75.000"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff7f11]"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentChannel('qris')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    paymentChannel === 'qris'
                      ? 'border-[#ff7f11] bg-orange-50/70 text-[#ff7f11]'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS (Semua E-Wallet)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('va')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    paymentChannel === 'va'
                      ? 'border-[#ff7f11] bg-orange-50/70 text-[#ff7f11]'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Transfer Virtual Account</span>
                </button>
              </div>
            </div>

            {/* Total Summary Preview */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 block text-[10px]">Total Saldo Setelah Top Up</span>
                <span className="font-extrabold text-[#0c1b33] text-sm font-jakarta">
                  Rp {previewTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="font-bold text-[#ff7f11] bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                +Rp {effectiveAmount.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || effectiveAmount <= 0}
              className="w-full h-12 bg-[#ff7f11] hover:bg-[#e06d0b] text-white font-extrabold text-sm rounded-full shadow-md active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Memproses...' : `Konfirmasi Top Up Rp ${effectiveAmount.toLocaleString('id-ID')}`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
