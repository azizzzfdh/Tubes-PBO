# Perubahan Fitur SIPANDU

## Fitur baru yang ditambahkan

1. **Export PDF tanpa dependency tambahan**
   - Menggunakan utilitas `src/utils/pdfExport.js`.
   - Export PDF memanfaatkan fitur print browser, sehingga pengguna dapat memilih `Save as PDF`.
   - Tombol export ditambahkan pada:
     - Admin > Data Pengaduan
     - Admin > Data Pelayanan
     - Admin > Riwayat Pelayanan
     - Warga > Pengaduan Saya
     - Bukti permohonan KTP

2. **Layanan Pembuatan KTP**
   - Halaman baru: `/warga/layanan-ktp`.
   - Menu baru di sidebar warga: `Layanan KTP`.
   - Form khusus untuk:
     - Pembuatan KTP Baru
     - Perubahan Data KTP
     - Penggantian KTP Hilang
     - Penggantian KTP Rusak
   - Validasi NIK dan Nomor KK wajib 16 digit angka.
   - Setelah dikirim, permohonan KTP otomatis masuk sebagai data pengaduan kategori `Pembuatan KTP`.
   - Bukti permohonan dapat diexport menjadi PDF.

3. **Perbaikan data warga**
   - `PengaduanResponse` backend sekarang mengirim `idMasyarakat` dan `idKategori`.
   - Halaman warga sekarang dapat menampilkan riwayat pengaduan milik user yang sedang login dengan lebih akurat.
   - Endpoint baru backend: `GET /api/pengaduan/masyarakat/{idMasyarakat}`.

4. **Perbaikan pelayanan**
   - `PelayananRequest` sekarang menerima `tanggalProses` dari form frontend.
   - `PelayananResponse` sekarang mengirim `namaMasyarakat` dan `kategori`, sehingga tabel pelayanan lebih informatif.
   - Tombol `Detail PDF` ditambahkan pada data pelayanan.

5. **Seed database layanan KTP**
   - `sipandu-backend/src/main/resources/data.sql` ditambahkan kategori `Pembuatan KTP`.
   - `database/sipandu_db.sql` juga diperbarui agar import manual memiliki kategori yang sama.

## Cara menggunakan fitur export PDF

Klik tombol `Export PDF`, lalu pada dialog print browser pilih tujuan printer `Save as PDF` / `Simpan sebagai PDF`.

## Catatan penting

- Build frontend tidak dapat diverifikasi penuh di environment ini karena `node_modules` dalam arsip berisi native binding Windows (`rolldown-binding.win32-x64-msvc`), sedangkan environment pemeriksaan menggunakan Linux. Source React sudah dicek parse JSX dan tidak ditemukan error sintaks.
- Backend belum dapat dikompilasi di environment ini karena Maven tidak tersedia. Perubahan Java dibuat mengikuti struktur service/controller/model yang sudah ada.

## Tambahan Fitur Notifikasi Admin

- Menambahkan fitur notifikasi pada panel admin ketika warga mengirim pengaduan baru.
- Notifikasi tersimpan di database melalui tabel `notifikasi_admin`, sehingga tetap muncul walaupun admin dan warga memakai browser/perangkat berbeda.
- Backend otomatis membuat notifikasi baru setiap kali endpoint `POST /api/pengaduan` berhasil menyimpan pengaduan.
- Endpoint baru:
  - `GET /api/notifikasi-admin`
  - `GET /api/notifikasi-admin/unread`
  - `GET /api/notifikasi-admin/unread/count`
  - `PUT /api/notifikasi-admin/{id}/read`
  - `PUT /api/notifikasi-admin/read-all`
- Frontend admin sekarang memiliki ikon lonceng notifikasi di bagian kanan atas layout admin.
- Notifikasi admin diperbarui otomatis setiap 8 detik dan menampilkan pop-up jika ada pengaduan baru.
- Admin dapat membuka daftar notifikasi, melihat jumlah notifikasi belum dibaca, dan menandai semua sebagai sudah dibaca.

## Revisi Interaktif Admin & Profil

### 1. Top Navigation Admin
- Menu `Executive Overview`, `Reports`, `History`, dan `Activity` sekarang menjadi navigasi aktif.
- Ditambahkan halaman baru:
  - `/admin/reports`
  - `/admin/history`
  - `/admin/activity`

### 2. Reports Interaktif
- Laporan admin berisi ringkasan total pengaduan, kasus aktif, tingkat selesai, jumlah warga, dan kategori.
- Filter laporan berdasarkan status, kategori, bulan, dan kata kunci.
- Data report bisa diexport ke PDF sesuai filter aktif.

### 3. History dan Activity
- History menampilkan timeline gabungan dari pengaduan, pelayanan, dan notifikasi.
- Activity menampilkan feed aktivitas terbaru dengan auto refresh setiap 10 detik.
- Activity menampilkan jumlah pengaduan hari ini, pelayanan hari ini, follow-up aktif, dan notifikasi belum dibaca.

### 4. Search Navbar Admin
- Search di kanan atas admin sekarang aktif.
- Search mencari data dari pengaduan, masyarakat, kategori, dan pelayanan.
- Hasil pencarian bisa diklik untuk membuka halaman terkait.

### 5. Account Menu / Avatar Interaktif
- Avatar kanan atas admin dan warga sekarang bisa diklik.
- Dropdown akun menampilkan profil, email, role, menu read/update profil, quick CRUD, dan logout.

### 6. Edit Profil Admin dan Warga
- Admin dapat mengubah nama, email, jabatan, dan password opsional.
- Warga dapat mengubah nama, email, nomor HP, alamat, dan password opsional.
- Password tidak lagi wajib dikirim saat update profil.
- Password tidak ikut dikembalikan pada response JSON backend.

## Revisi UI Profesional - Sidebar Collapse & Polish

Tambahan pada revisi ini:

1. Sidebar admin bisa ditutup/dibuka menjadi mode compact icon-only.
   - Tombol panah tersedia di sidebar.
   - Tombol hamburger tersedia di topbar admin.
   - Shortcut keyboard: `Ctrl + B`.
   - Preferensi tersimpan di `localStorage`, sehingga tetap sama setelah reload.

2. Sidebar warga/user juga bisa ditutup/dibuka.
   - Mode compact tetap menampilkan ikon menu.
   - Tooltip nama menu muncul saat hover.
   - Shortcut keyboard: `Ctrl + B`.

3. Tampilan admin dibuat lebih profesional.
   - Context bar berisi breadcrumb halaman aktif, status online, waktu update, dan hint shortcut.
   - Menu sidebar memiliki micro-hint agar tidak terlihat seperti template statis.
   - Search admin bisa difokuskan dengan shortcut `/` dan ditutup dengan `Esc`.

4. Dropdown akun dibuat lebih hidup.
   - Ada indikator kelengkapan profil.
   - Ada catatan sesi aktif.
   - Quick CRUD menu tetap tersedia untuk admin dan warga.

5. Logout sidebar sekarang ikut membersihkan session user melalui fungsi `logout()`.

## Revisi UI Warga agar Rapi seperti Admin

- Menambahkan `WargaLayout.jsx` sebagai layout warga yang seragam dengan admin: mini navigation, context bar, hero panel, profile card, dan action area.
- Menambahkan `WargaSearchBox.jsx` agar navbar warga bisa mencari menu layanan seperti Dashboard, Buat Pengaduan, Riwayat, Layanan KTP, dan Profil.
- Memperbaiki sidebar warga supaya tidak keluar area: hint menu dibuat dua baris, teks tidak overflow, mode collapse lebih rapi, dan tombol toggle tidak menimpa logo.
- Semua halaman warga kini memakai layout baru: Dashboard, Buat Pengaduan, Pengaduan Saya, Layanan KTP, dan Profil Saya.
- Shortcut warga:
  - `Ctrl+B` untuk buka/tutup sidebar.
  - `/` untuk fokus ke pencarian layanan.
  - `Esc` untuk menutup hasil pencarian.
