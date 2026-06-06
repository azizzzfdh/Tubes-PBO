package com.sipandu.service.impl;

import com.sipandu.dto.request.PelayananRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.PelayananResponse;
import com.sipandu.dto.response.RiwayatPelayananResponse;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.*;
import com.sipandu.repository.*;
import com.sipandu.service.PelayananService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PelayananServiceImpl implements PelayananService {

    private final PelayananRepository pelayananRepository;
    private final PengaduanRepository pengaduanRepository;
    private final AdminRepository adminRepository;
    private final RiwayatPelayananRepository riwayatPelayananRepository;

    public PelayananServiceImpl(
            PelayananRepository pelayananRepository,
            PengaduanRepository pengaduanRepository,
            AdminRepository adminRepository,
            RiwayatPelayananRepository riwayatPelayananRepository
    ) {
        this.pelayananRepository = pelayananRepository;
        this.pengaduanRepository = pengaduanRepository;
        this.adminRepository = adminRepository;
        this.riwayatPelayananRepository = riwayatPelayananRepository;
    }

    @Override
    public PelayananResponse createPelayanan(PelayananRequest request) {
        Pengaduan pengaduan = pengaduanRepository.findById(request.getIdPengaduan())
                .orElseThrow(() -> new ResourceNotFoundException("Pengaduan tidak ditemukan"));

        Admin admin = adminRepository.findById(request.getIdAdmin())
                .orElseThrow(() -> new ResourceNotFoundException("Admin tidak ditemukan"));

        Pelayanan pelayanan = new Pelayanan();
        pelayanan.setPengaduan(pengaduan);
        pelayanan.setAdmin(admin);
        pelayanan.setKeterangan(request.getKeterangan());
        pelayanan.setTanggalProses(request.getTanggalProses());
        pelayanan.setStatusPelayanan(request.getStatusPelayanan());

        pengaduan.setStatus(request.getStatusPelayanan());
        pengaduanRepository.save(pengaduan);

        Pelayanan saved = pelayananRepository.save(pelayanan);

        simpanRiwayat(
                saved,
                null,
                saved.getStatusPelayanan(),
                "Pelayanan dibuat"
        );

        return PelayananResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PelayananResponse> getAllPelayanan() {
        return pelayananRepository.findAll()
                .stream()
                .map(PelayananResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PelayananResponse getPelayananById(Long id) {
        Pelayanan pelayanan = pelayananRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pelayanan tidak ditemukan"));

        return PelayananResponse.from(pelayanan);
    }

    @Override
    public PelayananResponse updateStatusPelayanan(Long id, UpdateStatusRequest request) {
        Pelayanan pelayanan = pelayananRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pelayanan tidak ditemukan"));

        StatusPengaduan statusLama = pelayanan.getStatusPelayanan();
        StatusPengaduan statusBaru = request.getStatus();

        pelayanan.setStatusPelayanan(statusBaru);

        if (pelayanan.getPengaduan() != null) {
            pelayanan.getPengaduan().setStatus(statusBaru);
            pengaduanRepository.save(pelayanan.getPengaduan());
        }

        Pelayanan saved = pelayananRepository.save(pelayanan);

        simpanRiwayat(
                saved,
                statusLama,
                statusBaru,
                request.getCatatan()
        );

        return PelayananResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RiwayatPelayananResponse> getRiwayatPelayanan(Long idPelayanan) {
        if (!pelayananRepository.existsById(idPelayanan)) {
            throw new ResourceNotFoundException("Pelayanan tidak ditemukan");
        }

        return riwayatPelayananRepository
                .findByPelayananIdPelayananOrderByTanggalUpdateDesc(idPelayanan)
                .stream()
                .map(RiwayatPelayananResponse::from)
                .toList();
    }

    @Override
    public void deletePelayanan(Long id) {
        Pelayanan pelayanan = pelayananRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pelayanan tidak ditemukan"));

        List<RiwayatPelayanan> riwayatList = riwayatPelayananRepository
                .findByPelayananIdPelayananOrderByTanggalUpdateDesc(id);

        riwayatPelayananRepository.deleteAll(riwayatList);

        pelayananRepository.delete(pelayanan);
    }

    private void simpanRiwayat(
            Pelayanan pelayanan,
            StatusPengaduan statusLama,
            StatusPengaduan statusBaru,
            String catatan
    ) {
        RiwayatPelayanan riwayat = new RiwayatPelayanan();

        riwayat.setPelayanan(pelayanan);
        riwayat.setStatusLama(statusLama);
        riwayat.setStatusBaru(statusBaru);
        riwayat.setCatatan(catatan);

        riwayatPelayananRepository.save(riwayat);
    }
}