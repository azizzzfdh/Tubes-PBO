package com.sipandu.controller;

import com.sipandu.dto.request.AdminRequest;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.model.Admin;
import com.sipandu.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ApiResponse<List<Admin>> getAll() {
        return ApiResponse.ok("Data admin berhasil diambil", adminService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Admin> getById(@PathVariable Long id) {
        return ApiResponse.ok("Detail admin berhasil diambil", adminService.getById(id));
    }

    @PostMapping
    public ApiResponse<Admin> create(@Valid @RequestBody AdminRequest request) {
        return ApiResponse.ok("Admin berhasil ditambahkan", adminService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Admin> update(@PathVariable Long id, @Valid @RequestBody AdminRequest request) {
        return ApiResponse.ok("Admin berhasil diupdate", adminService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ApiResponse.ok("Admin berhasil dihapus", "OK");
    }
}