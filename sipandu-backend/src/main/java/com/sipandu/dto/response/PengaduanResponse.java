package com.sipandu.dto.response;

import com.sipandu.model.Pengaduan;

import java.time.LocalDate;

public class PengaduanResponse {
    private Long idPengaduan;
    private Long idMasyarakat;
    private Long idKategori;
    private String namaMasyarakat;
    private String kategori;
    private String judul;
    private String isiPengaduan;
    private LocalDate tanggalPengaduan;
    private String status;

    public PengaduanResponse() {
    }

    public PengaduanResponse(Long idPengaduan, Long idMasyarakat, Long idKategori,
                             String namaMasyarakat, String kategori,
                             String judul, String isiPengaduan,
                             LocalDate tanggalPengaduan, String status) {
        this.idPengaduan = idPengaduan;
        this.idMasyarakat = idMasyarakat;
        this.idKategori = idKategori;
        this.namaMasyarakat = namaMasyarakat;
        this.kategori = kategori;
        this.judul = judul;
        this.isiPengaduan = isiPengaduan;
        this.tanggalPengaduan = tanggalPengaduan;
        this.status = status;
    }

    public static PengaduanResponse fromEntity(Pengaduan pengaduan) {
        return new PengaduanResponse(
                pengaduan.getIdPengaduan(),
                pengaduan.getMasyarakat() != null ? pengaduan.getMasyarakat().getIdMasyarakat() : null,
                pengaduan.getKategoriLayanan() != null ? pengaduan.getKategoriLayanan().getIdKategori() : null,
                pengaduan.getMasyarakat() != null ? pengaduan.getMasyarakat().getNama() : null,
                pengaduan.getKategoriLayanan() != null ? pengaduan.getKategoriLayanan().getNamaKategori() : null,
                pengaduan.getJudul(),
                pengaduan.getIsiPengaduan(),
                pengaduan.getTanggalPengaduan(),
                pengaduan.getStatus() != null ? pengaduan.getStatus().name() : null
        );
    }

    public static PengaduanResponse from(Pengaduan pengaduan) {
        return fromEntity(pengaduan);
    }

    public Long getIdPengaduan() {
        return idPengaduan;
    }

    public void setIdPengaduan(Long idPengaduan) {
        this.idPengaduan = idPengaduan;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
