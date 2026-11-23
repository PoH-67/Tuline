# TULINE - Semua Urusan Tukang, Tinggal Online!

Aplikasi web & mobile **TULINE** dibangun menggunakan **React JS + Tailwind CSS**, backend **Firebase**, dan native mobile wrapper **Capacitor**.

---

## 🚀 Fitur & Halaman Utama

1. **Autentikasi Akun (Gerbang Masuk Aplikasi)**
   - **Log In (`/login`)**: Masuk menggunakan Email & Password dengan proteksi rute (pengguna wajib login sebelum dapat mengakses fitur aplikasi).
   - **Sign Up (`/register`)**: Pendaftaran akun baru dengan verifikasi input.
2. **Beranda (`/`)**
   - Kartu **Saku TULINE** dengan saldo aktif & tombol Top Up.
   - Greeting personal *"Halo, User!"* & headline *"Ada yang perlu diperbaiki? Serahkan pada ahlinya!"*.
   - Tombol cepat **Panggil Sekarang**.
   - **Search Bar** pencarian perbaikan.
   - 3 Kategori Utama: **Reparasi** (Elektronik & AC), **Instalasi** (Listrik & Pipa), dan **Renovasi** (Sipil & Cat).
   - Banner **Asisten AI TULINE** untuk konsultasi cepat.
   - Kartu **Nota & Status Pesanan** aktif.
3. **Pemesanan Jasa Servis (`/order/new`)**
   - Pilihan kategori (Perangkat Elektronik, Listrik Bangunan, Ledeng, Furnitur, Sipil & Bangunan).
   - Dropdown sub-kategori spesifik (Kulkas, AC, Mesin Cuci, dll).
   - Kolom Detail Masalah & upload foto keluhan (Wajib).
   - Alamat lengkap pemanggil teknisi (Wajib diisi).
   - Jadwal Kunjungan (Tanggal & Jam sesuai zona WIB UTC+7, proteksi waktu lewat).
   - Catatan Tambahan (Opsional).
   - Pilihan metode pembayaran (Saku TULINE).
4. **Hasil Pencarian Teknisi (`/teknisi`)**
   - Filter pills bersih: Rekomendasi, Rating ≥ 4.8, Jarak ≤ 2.5 km, Rating Tertinggi.
   - Daftar teknisi multi-skill terverifikasi (Ilham Sersa, Budiono Siregar, Agus Santoso, Hendra Pratama, Rudi Kurnia, Bambang Pamungkas, dll).
5. **Detail Profil Teknisi (`/teknisi/:id`)**
   - Foto profil teknisi, nama, ulasan, jarak, bio pengalaman, tarif jasa, dan tombol Tambah Favorit.
6. **Pelacakan Status Pesanan (`/pesanan/:id`)**
   - Peta interaktif Leaflet GPS live teknisi bergerak realtime dengan HUD koordinat dan sisa jarak.
   - Timeline perjalanan pesanan bertahap otomatis (delay 10 detik per tahap).
7. **Rincian Total Biaya & Pelunasan (`/pesanan/:id/invoice`)**
   - Rincian biaya transparan (biaya kunjungan + perbaikan).
   - Status 'Pembayaran' pada pesanan aktif hingga pelunasan berhasil via Saku TULINE.
   - Tombol Simpan ke Teknisi Favorit dan formulir rating/ulasan.
8. **Konsultasi AI TULINE (`/konsultasi-ai`)**
   - Tanya jawab interaktif seputar kendala rumah tangga sebelum memanggil teknisi.
9. **Teknisi Favorit (`/favorit`)**
   - Daftar teknisi langganan yang disimpan dari pesanan selesai atau profil teknisi.

---

## 📱 Mobile App (Capacitor)

```bash
# Build web & sync ke Android
npm run cap:build

# Buka Android Studio untuk Run di HP / Build APK
npm run cap:open
```

---

## 🌐 Deploy ke Vercel

```bash
git push -u origin main
```
Import repositori ke dashboard Vercel dengan framework preset Vite.
