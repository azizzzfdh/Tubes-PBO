package com.sipandu.repository;

import com.sipandu.model.Pengaduan;
import com.sipandu.model.StatusPengaduan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PengaduanRepository extends JpaRepository<Pengaduan, Long> {
    List<Pengaduan> findByStatus(StatusPengaduan status);
    List<Pengaduan> findByMasyarakatIdMasyarakat(Long idMasyarakat);
    long countByStatus(StatusPengaduan status);
}