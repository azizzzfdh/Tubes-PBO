package com.sipandu.dto.request;

import com.sipandu.model.StatusPengaduan;
import jakarta.validation.constraints.NotNull;

public class PelayananRequest {

    @NotNull(message = "Id pengaduan wajib diisi")
    private Long idPengaduan;

    @NotNull(message = "Id admin wajib diisi")
    private Long idAdmin;

    private String keterangan;

    @NotNull(message = "Status pelayanan wajib diisi")
    private StatusPengaduan statusPelayanan;

    public Long getIdPengaduan() {
        return idPengaduan;
    }

    public void setIdPengaduan(Long idPengaduan) {
        this.idPengaduan = idPengaduan;
    }

    public Long getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(Long idAdmin) {
        this.idAdmin = idAdmin;
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