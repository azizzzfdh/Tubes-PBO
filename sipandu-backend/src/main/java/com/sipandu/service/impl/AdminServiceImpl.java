package com.sipandu.service.impl;

import com.sipandu.dto.request.AdminRequest;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.Admin;
import com.sipandu.repository.AdminRepository;
import com.sipandu.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public List<Admin> getAll() {
        return adminRepository.findAll();
    }

    @Override
    public Admin getById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin tidak ditemukan"));
    }

    @Override
    public Admin create(AdminRequest request) {
        Admin admin = new Admin();
        admin.setNama(request.getNama());
        admin.setEmail(request.getEmail());
        admin.setPassword(request.getPassword());
        admin.setJabatan(request.getJabatan());
        return adminRepository.save(admin);
    }

    @Override
    public Admin update(Long id, AdminRequest request) {
        Admin admin = getById(id);
        admin.setNama(request.getNama());
        admin.setEmail(request.getEmail());
        admin.setPassword(request.getPassword());
        admin.setJabatan(request.getJabatan());
        return adminRepository.save(admin);
    }

    @Override
    public void delete(Long id) {
        Admin admin = getById(id);
        adminRepository.delete(admin);
    }
}