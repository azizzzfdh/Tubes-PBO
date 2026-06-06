package com.sipandu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "masyarakat")
public class Masyarakat extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_masyarakat")
    private Long idMasyarakat;

    @Column(name = "no_hp", length = 20)
    private String noHp;

    @Column(columnDefinition = "TEXT")
    private String alamat;

    @JsonIgnore
    @OneToMany(mappedBy = "masyarakat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pengaduan> pengaduanList = new ArrayList<>();

    public Long getIdMasyarakat() {
        return idMasyarakat;
    }

    public void setIdMasyarakat(Long idMasyarakat) {
        this.idMasyarakat = idMasyarakat;
    }

    public String getNoHp() {
        return noHp;
    }

    public void setNoHp(String noHp) {
        this.noHp = noHp;
    }

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    public List<Pengaduan> getPengaduanList() {
        return pengaduanList;
    }

    public void setPengaduanList(List<Pengaduan> pengaduanList) {
        this.pengaduanList = pengaduanList;
    }

    @Override
    public String getRole() {
        return "MASYARAKAT";
    }

    @Override
    public String getInfo() {
        return "Masyarakat: " + getNama();
    }
}