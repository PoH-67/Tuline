import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import OrderCreatePage from './pages/OrderCreatePage';
import WorkerSearchPage from './pages/WorkerSearchPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import OrderStatusPage from './pages/OrderStatusPage';
import InvoicePage from './pages/InvoicePage';
import AiConsultationPage from './pages/AiConsultationPage';
import OrdersListPage from './pages/OrdersListPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-xl border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-extrabold text-[#0c1b33] mb-2">Terjadi Kendala Tampilan</h2>
            <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl font-mono text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="w-full py-3 bg-[#ff7f11] text-white font-bold rounded-xl text-sm shadow hover:bg-[#e06d0b] transition"
            >
              Reset & Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/order/new" element={<OrderCreatePage />} />
            <Route path="/teknisi" element={<WorkerSearchPage />} />
            <Route path="/teknisi/:id" element={<WorkerDetailPage />} />
            <Route path="/pesanan" element={<OrdersListPage />} />
            <Route path="/pesanan/:id" element={<OrderStatusPage />} />
            <Route path="/pesanan/:id/invoice" element={<InvoicePage />} />
            <Route path="/konsultasi-ai" element={<AiConsultationPage />} />
            <Route path="/favorit" element={<FavoritesPage />} />
            <Route path="/notifikasi" element={<NotificationsPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
