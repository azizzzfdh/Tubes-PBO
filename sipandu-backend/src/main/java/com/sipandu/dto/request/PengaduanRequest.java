package com.sipandu.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PengaduanRequest {

    @NotNull(message = "Id masyarakat wajib diisi")
    private Long idMasyarakat;

    @NotNull(message = "Id kategori wajib diisi")
    private Long idKategori;

    @NotBlank(message = "Judul wajib diisi")
    private String judul;

    @NotBlank(message = "Isi pengaduan wajib diisi")
    private String isiPengaduan;

    public Long getIdMasyarakat() {
        return idMasyarakat;
    }

    public void setIdMasyarakat(Long idMasyarakat) {
        this.idMasyarakat = idMasyarakat;
    }

    public Long getIdKategori() {
        return idKategori;
    }

    public void setIdKategori(Long idKategori) {
        this.idKategori = idKategori;
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
}