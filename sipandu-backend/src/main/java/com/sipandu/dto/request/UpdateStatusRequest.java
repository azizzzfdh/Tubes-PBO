package com.sipandu.dto.request;

import com.sipandu.model.StatusPengaduan;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status wajib diisi")
    private StatusPengaduan status;

    private String catatan;

    public StatusPengaduan getStatus() {
        return status;
    }

    public void setStatus(StatusPengaduan status) {
        this.status = status;
    }

    public String getCatatan() {
        return catatan;
    }

    public void setCatatan(String catatan) {
        this.catatan = catatan;
    }
}