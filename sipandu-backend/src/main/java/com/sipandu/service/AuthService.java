package com.sipandu.service;

import com.sipandu.dto.request.LoginRequest;
import com.sipandu.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}