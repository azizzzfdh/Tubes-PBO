package com.sipandu.controller;

import com.sipandu.dto.request.LoginRequest;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.dto.response.LoginResponse;
import com.sipandu.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.ok("Login berhasil", response);
    }
}