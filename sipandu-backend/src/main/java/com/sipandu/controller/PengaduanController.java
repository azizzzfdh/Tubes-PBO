package com.sipandu.controller;

import com.sipandu.dto.request.PengaduanRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.dto.response.PengaduanResponse;
import com.sipandu.service.PengaduanService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pengaduan")
@CrossOrigin(origins = "*")
public class PengaduanController {

    private final PengaduanService pengaduanService;

    public PengaduanController(PengaduanService pengaduanService) {
        this.pengaduanService = pengaduanService;
    }

    @PostMapping
    public ApiResponse<PengaduanResponse> create(@Valid @RequestBody PengaduanRequest request) {
        return ApiResponse.ok("Pengaduan berhasil ditambahkan", pengaduanService.createPengaduan(request));
    }

    @GetMapping
    public ApiResponse<List<PengaduanResponse>> getAll() {
        return ApiResponse.ok("Data pengaduan berhasil diambil", pengaduanService.getAllPengaduan());
    }

    @GetMapping("/{id}")
    public ApiResponse<PengaduanResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok("Detail pengaduan berhasil diambil", pengaduanService.getPengaduanById(id));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<PengaduanResponse> updateStatus(@PathVariable Long id,
                                                       @Valid @RequestBody UpdateStatusRequest request) {
        return ApiResponse.ok("Status pengaduan berhasil diupdate", pengaduanService.updateStatusPengaduan(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        pengaduanService.deletePengaduan(id);
        return ApiResponse.ok("Pengaduan berhasil dihapus", "OK");
    }
}