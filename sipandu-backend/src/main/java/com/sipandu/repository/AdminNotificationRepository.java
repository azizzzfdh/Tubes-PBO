package com.sipandu.repository;

import com.sipandu.model.AdminNotification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminNotificationRepository extends JpaRepository<AdminNotification, Long> {
    @EntityGraph(attributePaths = {"pengaduan", "pengaduan.masyarakat", "pengaduan.kategoriLayanan"})
    List<AdminNotification> findTop15ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"pengaduan", "pengaduan.masyarakat", "pengaduan.kategoriLayanan"})
    List<AdminNotification> findByDibacaFalseOrderByCreatedAtDesc();

    long countByDibacaFalse();
    void deleteByPengaduanIdPengaduan(Long idPengaduan);
}
