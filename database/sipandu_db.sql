-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2026 at 06:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.5.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sipandu_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `jabatan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `created_at`, `updated_at`, `email`, `nama`, `password`, `jabatan`) VALUES
(1, '2026-05-02 12:35:58.000000', '2026-05-02 12:35:58.000000', 'admin@sipandu.local', 'Admin Desa', 'password', 'Petugas Pelayanan');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_layanan`
--

CREATE TABLE `kategori_layanan` (
  `id_kategori` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `nama_kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori_layanan`
--

INSERT INTO `kategori_layanan` (`id_kategori`, `created_at`, `updated_at`, `deskripsi`, `nama_kategori`) VALUES
(1, '2026-05-02 12:35:58.000000', '2026-05-02 12:35:58.000000', 'Pengaduan jalan rusak, lampu mati, dan fasilitas umum', 'Infrastruktur'),
(2, '2026-05-02 12:35:58.000000', '2026-05-02 12:35:58.000000', 'Pengaduan sampah dan lingkungan', 'Kebersihan'),
(3, '2026-05-02 12:35:58.000000', '2026-05-02 12:35:58.000000', 'Permohonan surat domisili, surat pengantar, dan surat keterangan', 'Administrasi');

-- --------------------------------------------------------

--
-- Table structure for table `masyarakat`
--

CREATE TABLE `masyarakat` (
  `id_masyarakat` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `alamat` text DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `masyarakat`
--

INSERT INTO `masyarakat` (`id_masyarakat`, `created_at`, `updated_at`, `email`, `nama`, `password`, `alamat`, `no_hp`) VALUES
(1, '2026-05-02 12:35:58.000000', '2026-05-02 12:35:58.000000', 'budi@email.com', 'Budi Santoso', 'password', 'RT 03 RW 05', '08123456789');

-- --------------------------------------------------------

--
-- Table structure for table `pelayanan`
--

CREATE TABLE `pelayanan` (
  `id_pelayanan` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `status_pelayanan` enum('DIPROSES','DITOLAK','MENUNGGU','SELESAI') NOT NULL,
  `tanggal_proses` date NOT NULL,
  `id_admin` bigint(20) NOT NULL,
  `id_pengaduan` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan`
--

CREATE TABLE `pengaduan` (
  `id_pengaduan` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `isi_pengaduan` text NOT NULL,
  `judul` varchar(150) NOT NULL,
  `status` enum('DIPROSES','DITOLAK','MENUNGGU','SELESAI') NOT NULL,
  `tanggal_pengaduan` date NOT NULL,
  `id_kategori` bigint(20) NOT NULL,
  `id_masyarakat` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengaduan`
--

INSERT INTO `pengaduan` (`id_pengaduan`, `created_at`, `updated_at`, `isi_pengaduan`, `judul`, `status`, `tanggal_pengaduan`, `id_kategori`, `id_masyarakat`) VALUES
(1, '2026-05-23 11:45:03.000000', '2026-05-23 11:45:03.000000', 'Terdapat jalan rusak di jalan gatot subroto', 'Jalan Rusak', 'MENUNGGU', '2026-05-23', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan_petugas`
--

CREATE TABLE `pengaduan_petugas` (
  `id_pengaduan` bigint(20) NOT NULL,
  `id_admin` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_pelayanan`
--

CREATE TABLE `riwayat_pelayanan` (
  `id_riwayat` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `status_baru` enum('DIPROSES','DITOLAK','MENUNGGU','SELESAI') DEFAULT NULL,
  `status_lama` enum('DIPROSES','DITOLAK','MENUNGGU','SELESAI') DEFAULT NULL,
  `tanggal_update` date NOT NULL,
  `id_pelayanan` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `UKc0r9atamxvbhjjvy5j8da1kam` (`email`);

--
-- Indexes for table `kategori_layanan`
--
ALTER TABLE `kategori_layanan`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `masyarakat`
--
ALTER TABLE `masyarakat`
  ADD PRIMARY KEY (`id_masyarakat`),
  ADD UNIQUE KEY `UKk5pfq2jq3klmqehiuwrr0bok8` (`email`);

--
-- Indexes for table `pelayanan`
--
ALTER TABLE `pelayanan`
  ADD PRIMARY KEY (`id_pelayanan`),
  ADD KEY `FKackeq9mgb8vas254ej532e8t6` (`id_admin`),
  ADD KEY `FK7ec2ptvck3m7ts3jt1i5935d5` (`id_pengaduan`);

--
-- Indexes for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD PRIMARY KEY (`id_pengaduan`),
  ADD KEY `FK9p79886p32uywal9i52exxxud` (`id_kategori`),
  ADD KEY `FKa0u7wsubj35m2dh92wxgxy9ak` (`id_masyarakat`);

--
-- Indexes for table `pengaduan_petugas`
--
ALTER TABLE `pengaduan_petugas`
  ADD KEY `FKb5d3wf1vqpccpgp0bupdyirht` (`id_admin`),
  ADD KEY `FKc33l4d89mho7u03lxg9c11i8t` (`id_pengaduan`);

--
-- Indexes for table `riwayat_pelayanan`
--
ALTER TABLE `riwayat_pelayanan`
  ADD PRIMARY KEY (`id_riwayat`),
  ADD KEY `FK9eemfuw6mvwtbpv7nbpe2cxny` (`id_pelayanan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kategori_layanan`
--
ALTER TABLE `kategori_layanan`
  MODIFY `id_kategori` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `masyarakat`
--
ALTER TABLE `masyarakat`
  MODIFY `id_masyarakat` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pelayanan`
--
ALTER TABLE `pelayanan`
  MODIFY `id_pelayanan` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaduan`
--
ALTER TABLE `pengaduan`
  MODIFY `id_pengaduan` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `riwayat_pelayanan`
--
ALTER TABLE `riwayat_pelayanan`
  MODIFY `id_riwayat` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pelayanan`
--
ALTER TABLE `pelayanan`
  ADD CONSTRAINT `FK7ec2ptvck3m7ts3jt1i5935d5` FOREIGN KEY (`id_pengaduan`) REFERENCES `pengaduan` (`id_pengaduan`),
  ADD CONSTRAINT `FKackeq9mgb8vas254ej532e8t6` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`);

--
-- Constraints for table `pengaduan`
--
ALTER TABLE `pengaduan`
  ADD CONSTRAINT `FK9p79886p32uywal9i52exxxud` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_layanan` (`id_kategori`),
  ADD CONSTRAINT `FKa0u7wsubj35m2dh92wxgxy9ak` FOREIGN KEY (`id_masyarakat`) REFERENCES `masyarakat` (`id_masyarakat`);

--
-- Constraints for table `pengaduan_petugas`
--
ALTER TABLE `pengaduan_petugas`
  ADD CONSTRAINT `FKb5d3wf1vqpccpgp0bupdyirht` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`),
  ADD CONSTRAINT `FKc33l4d89mho7u03lxg9c11i8t` FOREIGN KEY (`id_pengaduan`) REFERENCES `pengaduan` (`id_pengaduan`);

--
-- Constraints for table `riwayat_pelayanan`
--
ALTER TABLE `riwayat_pelayanan`
  ADD CONSTRAINT `FK9eemfuw6mvwtbpv7nbpe2cxny` FOREIGN KEY (`id_pelayanan`) REFERENCES `pelayanan` (`id_pelayanan`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
