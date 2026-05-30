package com.sipandu.service;

import com.sipandu.dto.request.PengaduanRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.PengaduanResponse;

import java.util.List;

public interface PengaduanService {
    PengaduanResponse createPengaduan(PengaduanRequest request);
    List<PengaduanResponse> getAllPengaduan();
    PengaduanResponse getPengaduanById(Long id);
    PengaduanResponse updateStatusPengaduan(Long id, UpdateStatusRequest request);
    void deletePengaduan(Long id);
}