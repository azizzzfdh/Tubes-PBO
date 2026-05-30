package com.sipandu.service;

import com.sipandu.dto.request.AdminRequest;
import com.sipandu.model.Admin;

import java.util.List;

public interface AdminService {
    List<Admin> getAll();
    Admin getById(Long id);
    Admin create(AdminRequest request);
    Admin update(Long id, AdminRequest request);
    void delete(Long id);
}