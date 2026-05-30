package com.sipandu.service;

import com.sipandu.dto.request.PelayananRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.PelayananResponse;
import com.sipandu.dto.response.RiwayatPelayananResponse;

import java.util.List;

public interface PelayananService {

    PelayananResponse createPelayanan(PelayananRequest request);

    List<PelayananResponse> getAllPelayanan();

    PelayananResponse getPelayananById(Long id);

    PelayananResponse updateStatusPelayanan(Long id, UpdateStatusRequest request);

    List<RiwayatPelayananResponse> getRiwayatPelayanan(Long id);

    void deletePelayanan(Long id);
}