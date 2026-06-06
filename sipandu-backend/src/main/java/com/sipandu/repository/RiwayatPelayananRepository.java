package com.sipandu.repository;

import com.sipandu.model.RiwayatPelayanan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RiwayatPelayananRepository extends JpaRepository<RiwayatPelayanan, Long> {
    List<RiwayatPelayanan> findByPelayananIdPelayananOrderByTanggalUpdateDesc(Long idPelayanan);
}
