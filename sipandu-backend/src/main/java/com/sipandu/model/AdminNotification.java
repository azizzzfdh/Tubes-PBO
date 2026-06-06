package com.sipandu.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notifikasi_admin")
public class AdminNotification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notifikasi")
    private Long idNotification;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 60)
    private String type;

    @Column(nullable = false)
    private Boolean dibaca = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pengaduan")
    private Pengaduan pengaduan;

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

    public Pengaduan getPengaduan() {
        return pengaduan;
    }

    public void setPengaduan(Pengaduan pengaduan) {
        this.pengaduan = pengaduan;
    }

    @PrePersist
    void setDefaultDibaca() {
        if (dibaca == null) {
            dibaca = false;
        }
        if (type == null || type.isBlank()) {
            type = "INFO";
        }
    }

    @Override
    public String getInfo() {
        return "Notifikasi Admin: " + title;
    }
}
