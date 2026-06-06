package com.sipandu.controller;

import com.sipandu.dto.request.KategoriLayananRequest;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.model.KategoriLayanan;
import com.sipandu.service.KategoriLayananService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kategori")
@CrossOrigin(origins = "*")
public class KategoriLayananController {

    private final KategoriLayananService kategoriLayananService;

    public KategoriLayananController(KategoriLayananService kategoriLayananService) {
        this.kategoriLayananService = kategoriLayananService;
    }

    @GetMapping
    public ApiResponse<List<KategoriLayanan>> getAll() {
        return ApiResponse.ok("Data kategori layanan berhasil diambil", kategoriLayananService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<KategoriLayanan> getById(@PathVariable Long id) {
        return ApiResponse.ok("Detail kategori layanan berhasil diambil", kategoriLayananService.getById(id));
    }

    @PostMapping
    public ApiResponse<KategoriLayanan> create(@Valid @RequestBody KategoriLayananRequest request) {
        return ApiResponse.ok("Kategori layanan berhasil ditambahkan", kategoriLayananService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<KategoriLayanan> update(@PathVariable Long id, @Valid @RequestBody KategoriLayananRequest request) {
        return ApiResponse.ok("Kategori layanan berhasil diupdate", kategoriLayananService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        kategoriLayananService.delete(id);
        return ApiResponse.ok("Kategori layanan berhasil dihapus", "OK");
    }
}