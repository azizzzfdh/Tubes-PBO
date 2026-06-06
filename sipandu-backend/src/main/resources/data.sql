INSERT IGNORE INTO masyarakat (id_masyarakat, nama, email, password, no_hp, alamat, created_at, updated_at)
VALUES (1, 'Budi Santoso', 'budi@email.com', 'password', '08123456789', 'RT 03 RW 05', NOW(), NOW());

INSERT IGNORE INTO admin (id_admin, nama, email, password, jabatan, created_at, updated_at)
VALUES (1, 'Admin Desa', 'admin@sipandu.local', 'password', 'Petugas Pelayanan', NOW(), NOW());

INSERT IGNORE INTO kategori_layanan (id_kategori, nama_kategori, deskripsi, created_at, updated_at)
VALUES
(1, 'Infrastruktur', 'Pengaduan jalan rusak, lampu mati, dan fasilitas umum', NOW(), NOW()),
(2, 'Kebersihan', 'Pengaduan sampah dan lingkungan', NOW(), NOW()),
(3, 'Administrasi', 'Permohonan surat domisili, surat pengantar, dan surat keterangan', NOW(), NOW()),
(4, 'Pembuatan KTP', 'Layanan pembuatan KTP baru, perubahan data, serta penggantian KTP hilang atau rusak', NOW(), NOW());
