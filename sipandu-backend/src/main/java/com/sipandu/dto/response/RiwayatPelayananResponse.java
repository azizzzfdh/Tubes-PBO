package com.sipandu.dto.response;

import com.sipandu.model.RiwayatPelayanan;
import com.sipandu.model.StatusPengaduan;

import java.time.LocalDate;

public class RiwayatPelayananResponse {
    private Long idRiwayat;
    private Long idPelayanan;
    private StatusPengaduan statusLama;
    private StatusPengaduan statusBaru;
    private LocalDate tanggalUpdate;
    private String catatan;

    public RiwayatPelayananResponse() {
    }

    public RiwayatPelayananResponse(Long idRiwayat, Long idPelayanan,
                                    StatusPengaduan statusLama, StatusPengaduan statusBaru,
                                    LocalDate tanggalUpdate, String catatan) {
        this.idRiwayat = idRiwayat;
        this.idPelayanan = idPelayanan;
        this.statusLama = statusLama;
        this.statusBaru = statusBaru;
        this.tanggalUpdate = tanggalUpdate;
        this.catatan = catatan;
    }

    public static RiwayatPelayananResponse from(RiwayatPelayanan riwayat) {
        return new RiwayatPelayananResponse(
                riwayat.getIdRiwayat(),
                riwayat.getPelayanan() != null ? riwayat.getPelayanan().getIdPelayanan() : null,
                riwayat.getStatusLama(),
                riwayat.getStatusBaru(),
                riwayat.getTanggalUpdate(),
                riwayat.getCatatan()
        );
    }

    public Long getIdRiwayat() {
        return idRiwayat;
    }

    public void setIdRiwayat(Long idRiwayat) {
        this.idRiwayat = idRiwayat;
    }

    public Long getIdPelayanan() {
        return idPelayanan;
    }

    public void setIdPelayanan(Long idPelayanan) {
        this.idPelayanan = idPelayanan;
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
}