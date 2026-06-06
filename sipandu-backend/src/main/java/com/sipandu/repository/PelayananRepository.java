package com.sipandu.repository;

import com.sipandu.model.Pelayanan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PelayananRepository extends JpaRepository<Pelayanan, Long> {
    List<Pelayanan> findByPengaduanIdPengaduan(Long idPengaduan);
}
