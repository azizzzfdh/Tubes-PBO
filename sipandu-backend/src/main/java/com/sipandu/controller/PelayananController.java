package com.sipandu.controller;

import com.sipandu.dto.request.PelayananRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.dto.response.PelayananResponse;
import com.sipandu.dto.response.RiwayatPelayananResponse;
import com.sipandu.service.PelayananService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pelayanan")
@CrossOrigin(origins = "*")
public class PelayananController {

    private final PelayananService pelayananService;

    public PelayananController(PelayananService pelayananService) {
        this.pelayananService = pelayananService;
    }

    @PostMapping
    public ApiResponse<PelayananResponse> create(
            @Valid @RequestBody PelayananRequest request
    ) {
        return ApiResponse.ok(
                "Pelayanan berhasil ditambahkan",
                pelayananService.createPelayanan(request)
        );
    }

    @GetMapping
    public ApiResponse<List<PelayananResponse>> getAll() {
        return ApiResponse.ok(
                "Data pelayanan berhasil diambil",
                pelayananService.getAllPelayanan()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<PelayananResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(
                "Detail pelayanan berhasil diambil",
                pelayananService.getPelayananById(id)
        );
    }

    @PutMapping("/{id}/status")
    public ApiResponse<PelayananResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return ApiResponse.ok(
                "Status pelayanan berhasil diupdate",
                pelayananService.updateStatusPelayanan(id, request)
        );
    }

    @GetMapping("/{id}/riwayat")
    public ApiResponse<List<RiwayatPelayananResponse>> getRiwayat(
            @PathVariable Long id
    ) {
        return ApiResponse.ok(
                "Riwayat pelayanan berhasil diambil",
                pelayananService.getRiwayatPelayanan(id)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        pelayananService.deletePelayanan(id);

        return ApiResponse.ok(
                "Pelayanan berhasil dihapus",
                "OK"
        );
    }
}