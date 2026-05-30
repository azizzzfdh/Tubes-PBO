package com.sipandu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pengaduan")
public class Pengaduan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pengaduan")
    private Long idPengaduan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_masyarakat", nullable = false)
    private Masyarakat masyarakat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_kategori", nullable = false)
    private KategoriLayanan kategoriLayanan;

    @Column(nullable = false, length = 150)
    private String judul;

    @Column(name = "isi_pengaduan", nullable = false, columnDefinition = "TEXT")
    private String isiPengaduan;

    @Column(name = "tanggal_pengaduan", nullable = false)
    private LocalDate tanggalPengaduan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusPengaduan status = StatusPengaduan.MENUNGGU;

    @JsonIgnore
    @OneToMany(mappedBy = "pengaduan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pelayanan> pelayananList = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "pengaduan_petugas",
            joinColumns = @JoinColumn(name = "id_pengaduan"),
            inverseJoinColumns = @JoinColumn(name = "id_admin")
    )
    private List<Admin> petugas = new ArrayList<>();

    public Long getIdPengaduan() {
        return idPengaduan;
    }

    public void setIdPengaduan(Long idPengaduan) {
        this.idPengaduan = idPengaduan;
    }

    public Masyarakat getMasyarakat() {
        return masyarakat;
    }

    public void setMasyarakat(Masyarakat masyarakat) {
        this.masyarakat = masyarakat;
    }

    public KategoriLayanan getKategoriLayanan() {
        return kategoriLayanan;
    }

    public void setKategoriLayanan(KategoriLayanan kategoriLayanan) {
        this.kategoriLayanan = kategoriLayanan;
    }

    public String getJudul() {
        return judul;
    }

    public void setJudul(String judul) {
        this.judul = judul;
    }

    public String getIsiPengaduan() {
        return isiPengaduan;
    }

    public void setIsiPengaduan(String isiPengaduan) {
        this.isiPengaduan = isiPengaduan;
    }

    public LocalDate getTanggalPengaduan() {
        return tanggalPengaduan;
    }

    public void setTanggalPengaduan(LocalDate tanggalPengaduan) {
        this.tanggalPengaduan = tanggalPengaduan;
    }

    public StatusPengaduan getStatus() {
        return status;
    }

    public void setStatus(StatusPengaduan status) {
        this.status = status;
    }

    public List<Pelayanan> getPelayananList() {
        return pelayananList;
    }

    public void setPelayananList(List<Pelayanan> pelayananList) {
        this.pelayananList = pelayananList;
    }

    public List<Admin> getPetugas() {
        return petugas;
    }

    public void setPetugas(List<Admin> petugas) {
        this.petugas = petugas;
    }

    @PrePersist
    void setDefaultTanggal() {
        if (tanggalPengaduan == null) {
            tanggalPengaduan = LocalDate.now();
        }
        if (status == null) {
            status = StatusPengaduan.MENUNGGU;
        }
    }

    @Override
    public String getInfo() {
        return "Pengaduan: " + judul;
    }
}