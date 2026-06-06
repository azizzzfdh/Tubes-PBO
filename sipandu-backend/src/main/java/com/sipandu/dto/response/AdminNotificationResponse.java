package com.sipandu.dto.response;

import com.sipandu.model.AdminNotification;
import com.sipandu.model.Pengaduan;

import java.time.LocalDateTime;

public class AdminNotificationResponse {
    private Long idNotification;
    private String title;
    private String message;
    private String type;
    private Boolean dibaca;
    private Long idPengaduan;
    private String namaMasyarakat;
    private String kategori;
    private LocalDateTime createdAt;

    public AdminNotificationResponse() {
    }

    public AdminNotificationResponse(Long idNotification, String title, String message,
                                     String type, Boolean dibaca, Long idPengaduan,
                                     String namaMasyarakat, String kategori,
                                     LocalDateTime createdAt) {
        this.idNotification = idNotification;
        this.title = title;
        this.message = message;
        this.type = type;
        this.dibaca = dibaca;
        this.idPengaduan = idPengaduan;
        this.namaMasyarakat = namaMasyarakat;
        this.kategori = kategori;
        this.createdAt = createdAt;
    }

    public static AdminNotificationResponse from(AdminNotification notification) {
        Pengaduan pengaduan = notification.getPengaduan();

        return new AdminNotificationResponse(
                notification.getIdNotification(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getDibaca(),
                pengaduan != null ? pengaduan.getIdPengaduan() : null,
                pengaduan != null && pengaduan.getMasyarakat() != null ? pengaduan.getMasyarakat().getNama() : null,
                pengaduan != null && pengaduan.getKategoriLayanan() != null ? pengaduan.getKategoriLayanan().getNamaKategori() : null,
                notification.getCreatedAt()
        );
    }

    public Long getIdNotification() {
        return idNotification;
    }

    public void setIdNotification(Long idNotification) {
        this.idNotification = idNotification;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getDibaca() {
        return dibaca;
    }

    public void setDibaca(Boolean dibaca) {
        this.dibaca = dibaca;
    }

    public Long getIdPengaduan() {
        return idPengaduan;
    }

    public void setIdPengaduan(Long idPengaduan) {
        this.idPengaduan = idPengaduan;
    }

    public String getNamaMasyarakat() {
        return namaMasyarakat;
    }

    public void setNamaMasyarakat(String namaMasyarakat) {
        this.namaMasyarakat = namaMasyarakat;
    }

    public String getKategori() {
        return kategori;
    }

    public void setKategori(String kategori) {
        this.kategori = kategori;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
