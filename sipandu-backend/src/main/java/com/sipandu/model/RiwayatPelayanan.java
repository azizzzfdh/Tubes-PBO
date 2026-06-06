package com.sipandu.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "riwayat_pelayanan")
public class RiwayatPelayanan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_riwayat")
    private Long idRiwayat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pelayanan", nullable = false)
    private Pelayanan pelayanan;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_lama", length = 50)
    private StatusPengaduan statusLama;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_baru", length = 50)
    private StatusPengaduan statusBaru;

    @Column(name = "tanggal_update", nullable = false)
    private LocalDate tanggalUpdate;

    @Column(columnDefinition = "TEXT")
    private String catatan;

    public Long getIdRiwayat() {
        return idRiwayat;
    }

    public void setIdRiwayat(Long idRiwayat) {
        this.idRiwayat = idRiwayat;
    }

    public Pelayanan getPelayanan() {
        return pelayanan;
    }

    public void setPelayanan(Pelayanan pelayanan) {
        this.pelayanan = pelayanan;
    }

    public StatusPengaduan getStatusLama() {
        return statusLama;
    }

    public void setStatusLama(StatusPengaduan statusLama) {
        this.statusLama = statusLama;
    }

    public StatusPengaduan getStatusBaru() {
        return statusBaru;
    }

    public void setStatusBaru(StatusPengaduan statusBaru) {
        this.statusBaru = statusBaru;
    }

    public LocalDate getTanggalUpdate() {
        return tanggalUpdate;
    }

    public void setTanggalUpdate(LocalDate tanggalUpdate) {
        this.tanggalUpdate = tanggalUpdate;
    }

    public String getCatatan() {
        return catatan;
    }

    public void setCatatan(String catatan) {
        this.catatan = catatan;
    }

    @PrePersist
    void setDefaultTanggal() {
        if (tanggalUpdate == null) {
            tanggalUpdate = LocalDate.now();
        }
    }

    @Override
    public String getInfo() {
        return "Riwayat status: " + statusLama + " -> " + statusBaru;
    }
}