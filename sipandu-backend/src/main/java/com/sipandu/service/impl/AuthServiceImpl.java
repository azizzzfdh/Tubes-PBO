package com.sipandu.service.impl;

import com.sipandu.dto.request.LoginRequest;
import com.sipandu.dto.response.LoginResponse;
import com.sipandu.model.Admin;
import com.sipandu.model.Masyarakat;
import com.sipandu.repository.AdminRepository;
import com.sipandu.repository.MasyarakatRepository;
import com.sipandu.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final MasyarakatRepository masyarakatRepository;

    public AuthServiceImpl(AdminRepository adminRepository,
                           MasyarakatRepository masyarakatRepository) {
        this.adminRepository = adminRepository;
        this.masyarakatRepository = masyarakatRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail()).orElse(null);

        if (admin != null && admin.getPassword().equals(request.getPassword())) {
            return new LoginResponse(
                    admin.getIdAdmin(),
                    admin.getNama(),
                    admin.getEmail(),
                    admin.getRole()
            );
        }

        Masyarakat masyarakat = masyarakatRepository.findByEmail(request.getEmail()).orElse(null);

        if (masyarakat != null && masyarakat.getPassword().equals(request.getPassword())) {
            return new LoginResponse(
                    masyarakat.getIdMasyarakat(),
                    masyarakat.getNama(),
                    masyarakat.getEmail(),
                    masyarakat.getRole()
            );
        }

        throw new RuntimeException("Email atau password salah");
    }
}