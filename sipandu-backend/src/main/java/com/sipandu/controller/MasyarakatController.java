package com.sipandu.controller;

import com.sipandu.dto.request.MasyarakatRequest;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.model.Masyarakat;
import com.sipandu.service.MasyarakatService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/masyarakat")
@CrossOrigin(origins = "*")
public class MasyarakatController {

    private final MasyarakatService masyarakatService;

    public MasyarakatController(MasyarakatService masyarakatService) {
        this.masyarakatService = masyarakatService;
    }

    @GetMapping
    public ApiResponse<List<Masyarakat>> getAll() {
        return ApiResponse.ok("Data masyarakat berhasil diambil", masyarakatService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Masyarakat> getById(@PathVariable Long id) {
        return ApiResponse.ok("Detail masyarakat berhasil diambil", masyarakatService.getById(id));
    }

    @PostMapping
    public ApiResponse<Masyarakat> create(@Valid @RequestBody MasyarakatRequest request) {
        return ApiResponse.ok("Masyarakat berhasil ditambahkan", masyarakatService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Masyarakat> update(@PathVariable Long id, @Valid @RequestBody MasyarakatRequest request) {
        return ApiResponse.ok("Masyarakat berhasil diupdate", masyarakatService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        masyarakatService.delete(id);
        return ApiResponse.ok("Masyarakat berhasil dihapus", "OK");
    }
}