# BENERIN - Aplikasi Pemesanan Teknisi Panggilan ke Rumah

Aplikasi web & mobile prototype **BENERIN** dibangun menggunakan **React JS + Tailwind CSS** dan backend **Firebase**, dengan desain 100% presisi mengacu pada prototype Figma:
👉 **[Figma Prototype MVP](https://www.figma.com/design/H3unys0UZRups2EZhs3wWr/Buat-Prototype-MVP?node-id=0-1)**

---

## 🚀 Fitur & Halaman Sesuai Desain Figma

1. **Autentikasi Akun (Tanpa Google Login)**
   - **Log In (`/login`)**: Login menggunakan Email & Password, toggle Show/Hide password, link lupa password, dan opsi Akun Demo.
   - **Sign Up (`/register`)**: Pendaftaran akun baru dengan Nama Lengkap, Email, Password, serta persetujuan syarat/promo.
2. **Beranda (`/`)**
   - Kartu **Saku BENERIN** dengan saldo aktif & tombol Top Up.
   - Greeting personal *"Halo, User!"* & headline *"Ada yang perlu diperbaiki? Serahkan pada ahlinya!"*.
   - Tombol cepat **Panggil Sekarang**.
   - **Search Bar** pencarian perbaikan.
   - 3 Kategori Utama: **Reparasi** (Elektronik & AC), **Instalasi** (Listrik & Pipa), dan **Renovasi** (Sipil & Cat).
   - Banner **Asisten AI BENERIN** untuk konsultasi cepat.
   - Kartu **Nota & Status Pesanan** aktif.
3. **Pemesanan Jasa Servis (`/order/new`)**
   - Pilihan kategori (Perangkat Elektronik, Listrik Bangunan, Ledeng, Furnitur, Sipil & Bangunan).
   - Dropdown sub-kategori spesifik (Kulkas, AC, Mesin Cuci, dll).
   - Kolom Detail Masalah & upload foto keluhan.
   - Alamat lengkap pemanggil teknisi.
   - Jadwal Kunjungan (Tanggal & Jam).
   - Catatan Tambahan (patokan rumah / detail kerusakan).
   - Pilihan metode pembayaran (Saku BENERIN, Tunai, Transfer).
4. **Hasil Pencarian Teknisi (`/teknisi`)**
   - Filter pills: Kategori, Rating ≥ 4.8, Jarak ≤ 3 km, Tersedia, dan Rekomendasi.
   - Daftar teknisi asli dari Figma: **Ilham Sersa** *(Spesialis AC & Kulkas)*, **Budiono Siregar** *(Spesialis Elektronik)*, **Agus Santoso** *(Listrik)*, **Hendra Pratama** *(Ledeng)*, dll.
   - Badge keahlian *(Cepat dan Teliti, Peralatan Lengkap)*, rating bintang, jarak, dan biaya inspeksi mulai Rp50.000.
5. **Detail Profil Teknisi (`/teknisi/:id`)**
   - Foto profil teknisi, nama, ulasan, jarak, bio pengalaman, dan daftar tarif jasa.
   - Sticky bottom bar: Biaya kunjungan Rp55.000 + Tombol **Pesan Teknisi**.
6. **Pelacakan Status Pesanan (`/pesanan/:id`)**
   - Visual peta rute teknisi menuju rumah pelanggan.
   - **Grafik Circular Countdown**: Estimasi kedatangan (27.30 menit).
   - Tombol Telepon & Kirim Pesan langsung ke teknisi.
   - Timeline perjalanan pesanan bertahap:
     1. *Menunggu Konfirmasi*
     2. *Teknisi Menerima Pesanan (Tahap aktif simulasi)*
     3. *Teknisi Menuju Lokasi*
     4. *Pemeriksaan Kerusakan*
     5. *Estimasi & Persetujuan Biaya*
     6. *Perbaikan Selesai & Pembayaran*
7. **Konsultasi & Diagnosis AI (`/konsultasi-ai`)**
   - Chat interaktif dengan **Asisten AI BENERIN**.
   - Pilihan respons cepat (*"Ya, anginnya keluar tetapi tidak dingin"*, *"Tidak ada udara yang keluar"*, *"Ada bunyi aneh saat AC dinyalakan"*).
   - Kartu **Ringkasan Sementara** keluhan & tombol satu klik **Cari Teknisi Berdasarkan Ringkasan Ini**.
8. **Total Biaya Perbaikan & Invoice (`/pesanan/:id/invoice`)**
   - Rincian estimasi biaya jasa perbaikan + biaya kunjungan.
   - Jaminan garansi pekerjaan 30 hari.
   - Fitur penilaian bintang 1-5 & ulasan pelanggan.
   - Konfirmasi pembayaran selesai.
9. **Profil Saya (`/profil`)**
   - Avatar & identitas pengguna (Nama Pengguna, Alamat, Email, Nomor Telepon).
   - Form modal Edit Profil langsung.
   - Menu Riwayat Pesanan & Pusat Bantuan.
   - Tombol Keluar dari Akun.
10. **Navigasi Bawah (Bottom Navigation)**
    - Beranda, Favorit, Pesanan, Notifikasi, dan Profil dengan indikator aktif sesuai Figma.

---

## 🛠️ Menjalankan Proyek

```bash
# Masuk ke direktori proyek baru
cd C:\Users\USER\.gemini\antigravity\scratch\benerin-mvp

# Menjalankan server development
npm run dev

# Membuka aplikasi
http://localhost:5174
```
