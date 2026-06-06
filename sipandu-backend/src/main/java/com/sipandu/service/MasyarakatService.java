package com.sipandu.service;

import com.sipandu.dto.request.MasyarakatRequest;
import com.sipandu.model.Masyarakat;

import java.util.List;

public interface MasyarakatService {
    List<Masyarakat> getAll();
    Masyarakat getById(Long id);
    Masyarakat create(MasyarakatRequest request);
    Masyarakat update(Long id, MasyarakatRequest request);
    void delete(Long id);
}