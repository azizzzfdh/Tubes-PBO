package com.sipandu.dto.request;

import jakarta.validation.constraints.NotBlank;

public class KategoriLayananRequest {

    @NotBlank(message = "Nama kategori wajib diisi")
    private String namaKategori;

    private String deskripsi;

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
}