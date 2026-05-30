package com.sipandu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pelayanan")
public class Pelayanan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pelayanan")
    private Long idPelayanan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pengaduan", nullable = false)
    private Pengaduan pengaduan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_admin", nullable = false)
    private Admin admin;

    @Column(name = "tanggal_proses", nullable = false)
    private LocalDate tanggalProses;

    @Column(columnDefinition = "TEXT")
    private String keterangan;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pelayanan", nullable = false, length = 50)
    private StatusPengaduan statusPelayanan = StatusPengaduan.DIPROSES;

    @JsonIgnore
    @OneToMany(mappedBy = "pelayanan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RiwayatPelayanan> riwayatList = new ArrayList<>();

    public Long getIdPelayanan() {
        return idPelayanan;
    }

    public void setIdPelayanan(Long idPelayanan) {
        this.idPelayanan = idPelayanan;
    }

    public Pengaduan getPengaduan() {
        return pengaduan;
    }

    public void setPengaduan(Pengaduan pengaduan) {
        this.pengaduan = pengaduan;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public LocalDate getTanggalProses() {
        return tanggalProses;
    }

    public void setTanggalProses(LocalDate tanggalProses) {
        this.tanggalProses = tanggalProses;
    }

    public String getKeterangan() {
        return keterangan;
    }

    public void setKeterangan(String keterangan) {
        this.keterangan = keterangan;
    }

    public StatusPengaduan getStatusPelayanan() {
        return statusPelayanan;
    }

    public void setStatusPelayanan(StatusPengaduan statusPelayanan) {
        this.statusPelayanan = statusPelayanan;
    }

    public List<RiwayatPelayanan> getRiwayatList() {
        return riwayatList;
    }

    public void setRiwayatList(List<RiwayatPelayanan> riwayatList) {
        this.riwayatList = riwayatList;
    }

    @PrePersist
    void setDefaultTanggal() {
        if (tanggalProses == null) {
            tanggalProses = LocalDate.now();
        }
        if (statusPelayanan == null) {
            statusPelayanan = StatusPengaduan.DIPROSES;
        }
    }

    @Override
    public String getInfo() {
        return "Pelayanan ID: " + idPelayanan;
    }
}