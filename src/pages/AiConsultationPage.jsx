import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { getDiagnosisReply } from '../services/chatService';
import {
  ArrowLeft,
  Bot,
  Send,
  Cpu,
  PlusSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function AiConsultationPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Halo! Ceritakan keluhan Anda. Saya bantu merangkum sebelum diperiksa teknisi.',
    },
    {
      id: 2,
      sender: 'user',
      text: 'AC saya rusak',
    },
    {
      id: 3,
      sender: 'ai',
      text: 'Apakah AC masih mengeluarkan udara tetapi tidak terasa dingin?',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState([
    'Ya, anginnya keluar tetapi tidak dingin.',
    'Tidak ada udara yang keluar.',
    'Ada bunyi aneh saat AC dinyalakan',
  ]);

  const [summary, setSummary] = useState(
    'Keluhan: AC bermasalah. Perlu pemeriksaan teknisi AC.'
  );
  const [targetCategory, setTargetCategory] = useState('elektronik');
  const [targetSub, setTargetSub] = useState('Air Conditioner (AC)');

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    const reply = await getDiagnosisReply(text);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: reply.text,
        },
      ]);
      setSuggestions(reply.suggestions || []);
      if (reply.summary) setSummary(reply.summary);
      if (reply.recommendedCategory) {
        setTargetCategory(
          reply.recommendedCategory.toLowerCase().includes('listrik')
            ? 'listrik'
            : reply.recommendedCategory.toLowerCase().includes('ledeng')
            ? 'ledeng'
            : 'elektronik'
        );
      }
      if (reply.recommendedSub) setTargetSub(reply.recommendedSub);
    }, 500);
  };

  const handleProceedToBooking = () => {
    navigate(
      `/order/new?cat=${targetCategory}&sub=${encodeURIComponent(
        targetSub
      )}&problem=${encodeURIComponent(summary)}`
    );
  };

  return (
    <ResponsiveLayout
      pageTitle="Konsultasi AI TULINE"
      showBack
      onBack={() => navigate('/')}
      hideTopNav
      hideBottomNav
    >
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col gap-4">
        
        {/* Chat Banner */}
        <div className="bg-[#ffde59] rounded-3xl p-5 shadow-sm border border-yellow-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff7f11] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold font-jakarta text-[#0c1b33]">
                Asisten AI TULINE
              </h1>
              <p className="text-xs text-black/75">
                Konsultasi instan & diagnosa awal sebelum teknisi datang ke rumah
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-white/80 px-3 py-1 rounded-full text-[#ff7f11]">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>AI Aktif</span>
          </span>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-gray-200 flex-1 flex flex-col justify-between min-h-[460px]">
          
          {/* Chat Messages */}
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[500px] pr-1">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] ${
                    isUser ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#ff7f11] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#ffde59] text-black font-semibold rounded-br-none'
                        : 'bg-[#f8f9fe] text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                  >
                    {!isUser && (
                      <p className="text-[11px] font-bold text-[#ff7f11] mb-1">
                        Asisten AI BENERIN
                      </p>
                    )}
                    <p>{m.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Quick Suggestions Chips */}
            {suggestions.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-gray-500 pl-1">
                  Pilihan jawaban cepat:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="bg-white hover:bg-orange-50 border border-gray-300 hover:border-[#ff7f11] text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0c1b33] shadow-2xs active:scale-98 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>{sug}</span>
                      <span className="text-[#ff7f11]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ringkasan Sementara Box */}
            {summary && (
              <div className="bg-[#383838] text-white rounded-2xl p-4 mt-3 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-black/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffde59] flex items-center justify-center text-black shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#ffde59]">Ringkasan Sementara</h4>
                    <p className="text-xs text-gray-100 mt-0.5 leading-snug">{summary}</p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToBooking}
                  className="px-4 py-2.5 bg-[#ff7f11] hover:bg-[#e06d0b] text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Cari Teknisi Berdasarkan Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Chat Input */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            <button
              onClick={() => alert('Fitur upload foto bisa dilakukan pada form pemesanan.')}
              className="w-11 h-11 rounded-2xl bg-[#f7f5fb] hover:bg-gray-200 flex items-center justify-center text-gray-600 transition shrink-0"
              title="Lampirkan foto"
            >
              <PlusSquare className="w-5 h-5 text-gray-500" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Jelaskan masalah perbaikan di rumah Anda..."
              className="flex-1 h-11 px-4 bg-[#f7f5fb] rounded-2xl text-xs sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7f11] border border-gray-200"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className="w-11 h-11 rounded-2xl bg-[#ffde59] hover:bg-yellow-400 text-black flex items-center justify-center shadow-xs transition active:scale-90 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 -rotate-45" />
            </button>
          </div>

        </div>

      </div>
    </ResponsiveLayout>
  );
}
