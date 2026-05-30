package com.sipandu.service.impl;

import com.sipandu.dto.request.PengaduanRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.PengaduanResponse;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.KategoriLayanan;
import com.sipandu.model.Masyarakat;
import com.sipandu.model.Pengaduan;
import com.sipandu.repository.KategoriLayananRepository;
import com.sipandu.repository.MasyarakatRepository;
import com.sipandu.repository.PengaduanRepository;
import com.sipandu.service.PengaduanService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PengaduanServiceImpl implements PengaduanService {

    private final PengaduanRepository pengaduanRepository;
    private final MasyarakatRepository masyarakatRepository;
    private final KategoriLayananRepository kategoriLayananRepository;

    public PengaduanServiceImpl(PengaduanRepository pengaduanRepository,
                                MasyarakatRepository masyarakatRepository,
                                KategoriLayananRepository kategoriLayananRepository) {
        this.pengaduanRepository = pengaduanRepository;
        this.masyarakatRepository = masyarakatRepository;
        this.kategoriLayananRepository = kategoriLayananRepository;
    }

    @Override
    public PengaduanResponse createPengaduan(PengaduanRequest request) {
        Masyarakat masyarakat = masyarakatRepository.findById(request.getIdMasyarakat())
                .orElseThrow(() -> new ResourceNotFoundException("Masyarakat tidak ditemukan"));

        KategoriLayanan kategori = kategoriLayananRepository.findById(request.getIdKategori())
                .orElseThrow(() -> new ResourceNotFoundException("Kategori layanan tidak ditemukan"));

        Pengaduan pengaduan = new Pengaduan();
        pengaduan.setMasyarakat(masyarakat);
        pengaduan.setKategoriLayanan(kategori);
        pengaduan.setJudul(request.getJudul());
        pengaduan.setIsiPengaduan(request.getIsiPengaduan());

        Pengaduan saved = pengaduanRepository.save(pengaduan);
        return PengaduanResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PengaduanResponse> getAllPengaduan() {
        return pengaduanRepository.findAll()
                .stream()
                .map(PengaduanResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PengaduanResponse getPengaduanById(Long id) {
        Pengaduan pengaduan = pengaduanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pengaduan tidak ditemukan"));
        return PengaduanResponse.from(pengaduan);
    }

    @Override
    public PengaduanResponse updateStatusPengaduan(Long id, UpdateStatusRequest request) {
        Pengaduan pengaduan = pengaduanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pengaduan tidak ditemukan"));

        pengaduan.setStatus(request.getStatus());

        Pengaduan updated = pengaduanRepository.save(pengaduan);
        return PengaduanResponse.from(updated);
    }

    @Override
    public void deletePengaduan(Long id) {
        Pengaduan pengaduan = pengaduanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pengaduan tidak ditemukan"));
        pengaduanRepository.delete(pengaduan);
    }
}