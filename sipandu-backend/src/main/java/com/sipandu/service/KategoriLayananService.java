package com.sipandu.service;

import com.sipandu.dto.request.KategoriLayananRequest;
import com.sipandu.model.KategoriLayanan;

import java.util.List;

public interface KategoriLayananService {
    List<KategoriLayanan> getAll();
    KategoriLayanan getById(Long id);
    KategoriLayanan create(KategoriLayananRequest request);
    KategoriLayanan update(Long id, KategoriLayananRequest request);
    void delete(Long id);
}