package com.sipandu.dto.response;

import com.sipandu.model.Pelayanan;
import com.sipandu.model.StatusPengaduan;

import java.time.LocalDate;

public class PelayananResponse {
    private Long idPelayanan;
    private Long idPengaduan;
    private String judulPengaduan;
    private String namaAdmin;
    private LocalDate tanggalProses;
    private String keterangan;
    private StatusPengaduan statusPelayanan;

    public PelayananResponse() {
    }

    public PelayananResponse(Long idPelayanan, Long idPengaduan, String judulPengaduan,
                             String namaAdmin, LocalDate tanggalProses,
                             String keterangan, StatusPengaduan statusPelayanan) {
        this.idPelayanan = idPelayanan;
        this.idPengaduan = idPengaduan;
        this.judulPengaduan = judulPengaduan;
        this.namaAdmin = namaAdmin;
        this.tanggalProses = tanggalProses;
        this.keterangan = keterangan;
        this.statusPelayanan = statusPelayanan;
    }

    public static PelayananResponse from(Pelayanan pelayanan) {
        return new PelayananResponse(
                pelayanan.getIdPelayanan(),
                pelayanan.getPengaduan() != null ? pelayanan.getPengaduan().getIdPengaduan() : null,
                pelayanan.getPengaduan() != null ? pelayanan.getPengaduan().getJudul() : null,
                pelayanan.getAdmin() != null ? pelayanan.getAdmin().getNama() : null,
                pelayanan.getTanggalProses(),
                pelayanan.getKeterangan(),
                pelayanan.getStatusPelayanan()
        );
    }

    public Long getIdPelayanan() {
        return idPelayanan;
    }

    public void setIdPelayanan(Long idPelayanan) {
        this.idPelayanan = idPelayanan;
    }

    public Long getIdPengaduan() {
        return idPengaduan;
    }

    public void setIdPengaduan(Long idPengaduan) {
        this.idPengaduan = idPengaduan;
    }

    public String getJudulPengaduan() {
        return judulPengaduan;
    }

    public void setJudulPengaduan(String judulPengaduan) {
        this.judulPengaduan = judulPengaduan;
    }

    public String getNamaAdmin() {
        return namaAdmin;
    }

    public void setNamaAdmin(String namaAdmin) {
        this.namaAdmin = namaAdmin;
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
}