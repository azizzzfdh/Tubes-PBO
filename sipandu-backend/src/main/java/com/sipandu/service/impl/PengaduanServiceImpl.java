package com.sipandu.service.impl;

import com.sipandu.dto.request.PengaduanRequest;
import com.sipandu.dto.request.UpdateStatusRequest;
import com.sipandu.dto.response.PengaduanResponse;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.AdminNotification;
import com.sipandu.model.KategoriLayanan;
import com.sipandu.model.Masyarakat;
import com.sipandu.model.Pengaduan;
import com.sipandu.repository.KategoriLayananRepository;
import com.sipandu.repository.MasyarakatRepository;
import com.sipandu.repository.AdminNotificationRepository;
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
    private final AdminNotificationRepository adminNotificationRepository;

    public PengaduanServiceImpl(PengaduanRepository pengaduanRepository,
                                MasyarakatRepository masyarakatRepository,
                                KategoriLayananRepository kategoriLayananRepository,
                                AdminNotificationRepository adminNotificationRepository) {
        this.pengaduanRepository = pengaduanRepository;
        this.masyarakatRepository = masyarakatRepository;
        this.kategoriLayananRepository = kategoriLayananRepository;
        this.adminNotificationRepository = adminNotificationRepository;
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
        createAdminNotification(saved);

        return PengaduanResponse.from(saved);
    }

    private void createAdminNotification(Pengaduan pengaduan) {
        String namaMasyarakat = pengaduan.getMasyarakat() != null ? pengaduan.getMasyarakat().getNama() : "Warga";
        String kategori = pengaduan.getKategoriLayanan() != null ? pengaduan.getKategoriLayanan().getNamaKategori() : "Layanan";

        AdminNotification notification = new AdminNotification();
        notification.setTitle("Pengaduan Baru Masuk");
        notification.setMessage(namaMasyarakat + " mengirim pengaduan kategori " + kategori + ": " + pengaduan.getJudul());
        notification.setType("PENGADUAN_BARU");
        notification.setDibaca(false);
        notification.setPengaduan(pengaduan);

        adminNotificationRepository.save(notification);
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
    public List<PengaduanResponse> getPengaduanByMasyarakat(Long idMasyarakat) {
        if (!masyarakatRepository.existsById(idMasyarakat)) {
            throw new ResourceNotFoundException("Masyarakat tidak ditemukan");
        }

        return pengaduanRepository.findByMasyarakatIdMasyarakat(idMasyarakat)
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

        adminNotificationRepository.deleteByPengaduanIdPengaduan(id);
        pengaduanRepository.delete(pengaduan);
    }
}