package com.sipandu.service.impl;

import com.sipandu.dto.request.KategoriLayananRequest;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.KategoriLayanan;
import com.sipandu.repository.KategoriLayananRepository;
import com.sipandu.service.KategoriLayananService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KategoriLayananServiceImpl implements KategoriLayananService {

    private final KategoriLayananRepository kategoriLayananRepository;

    public KategoriLayananServiceImpl(KategoriLayananRepository kategoriLayananRepository) {
        this.kategoriLayananRepository = kategoriLayananRepository;
    }

    @Override
    public List<KategoriLayanan> getAll() {
        return kategoriLayananRepository.findAll();
    }

    @Override
    public KategoriLayanan getById(Long id) {
        return kategoriLayananRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori layanan tidak ditemukan"));
    }

    @Override
    public KategoriLayanan create(KategoriLayananRequest request) {
        KategoriLayanan kategori = new KategoriLayanan();
        kategori.setNamaKategori(request.getNamaKategori());
        kategori.setDeskripsi(request.getDeskripsi());
        return kategoriLayananRepository.save(kategori);
    }

    @Override
    public KategoriLayanan update(Long id, KategoriLayananRequest request) {
        KategoriLayanan kategori = getById(id);
        kategori.setNamaKategori(request.getNamaKategori());
        kategori.setDeskripsi(request.getDeskripsi());
        return kategoriLayananRepository.save(kategori);
    }

    @Override
    public void delete(Long id) {
        KategoriLayanan kategori = getById(id);
        kategoriLayananRepository.delete(kategori);
    }
}