package com.sipandu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "admin")
public class Admin extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin")
    private Long idAdmin;

    @Column(length = 50)
    private String jabatan;

    @JsonIgnore
    @OneToMany(mappedBy = "admin")
    private List<Pelayanan> pelayananList = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "petugas")
    private List<Pengaduan> pengaduanDitangani = new ArrayList<>();

    public Long getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
    }

    public String getJabatan() {
        return jabatan;
    }

    public void setJabatan(String jabatan) {
        this.jabatan = jabatan;
    }

    public List<Pelayanan> getPelayananList() {
        return pelayananList;
    }

    public void setPelayananList(List<Pelayanan> pelayananList) {
        this.pelayananList = pelayananList;
    }

    public List<Pengaduan> getPengaduanDitangani() {
        return pengaduanDitangani;
    }

    public void setPengaduanDitangani(List<Pengaduan> pengaduanDitangani) {
        this.pengaduanDitangani = pengaduanDitangani;
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }

    @Override
    public String getInfo() {
        return "Admin: " + getNama();
    }
}