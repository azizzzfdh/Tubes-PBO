package com.sipandu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kategori_layanan")
public class KategoriLayanan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_kategori")
    private Long idKategori;

    @Column(name = "nama_kategori", nullable = false, length = 100)
    private String namaKategori;

    @Column(columnDefinition = "TEXT")
    private String deskripsi;

    @JsonIgnore
    @OneToMany(mappedBy = "kategoriLayanan")
    private List<Pengaduan> pengaduanList = new ArrayList<>();

    public Long getIdKategori() {
        return idKategori;
    }

    public void setIdKategori(Long idKategori) {
        this.idKategori = idKategori;
    }

    public String getNamaKategori() {
        return namaKategori;
    }

    public void setNamaKategori(String namaKategori) {
        this.namaKategori = namaKategori;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public List<Pengaduan> getPengaduanList() {
        return pengaduanList;
    }

    public void setPengaduanList(List<Pengaduan> pengaduanList) {
        this.pengaduanList = pengaduanList;
    }

    @Override
    public String getInfo() {
        return "Kategori: " + namaKategori;
    }
}