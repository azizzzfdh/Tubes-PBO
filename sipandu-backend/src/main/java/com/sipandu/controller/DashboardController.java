package com.sipandu.controller;

import com.sipandu.dto.response.ApiResponse;
import com.sipandu.model.StatusPengaduan;
import com.sipandu.repository.KategoriLayananRepository;
import com.sipandu.repository.MasyarakatRepository;
import com.sipandu.repository.PengaduanRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final PengaduanRepository pengaduanRepository;
    private final MasyarakatRepository masyarakatRepository;
    private final KategoriLayananRepository kategoriLayananRepository;

    public DashboardController(PengaduanRepository pengaduanRepository,
                               MasyarakatRepository masyarakatRepository,
                               KategoriLayananRepository kategoriLayananRepository) {
        this.pengaduanRepository = pengaduanRepository;
        this.masyarakatRepository = masyarakatRepository;
        this.kategoriLayananRepository = kategoriLayananRepository;
    }

    @GetMapping("/admin")
    public ApiResponse<Map<String, Object>> dashboardAdmin() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalPengaduan", pengaduanRepository.count());
        data.put("totalMasyarakat", masyarakatRepository.count());
        data.put("totalKategori", kategoriLayananRepository.count());
        data.put("menunggu", pengaduanRepository.countByStatus(StatusPengaduan.MENUNGGU));
        data.put("diproses", pengaduanRepository.countByStatus(StatusPengaduan.DIPROSES));
        data.put("selesai", pengaduanRepository.countByStatus(StatusPengaduan.SELESAI));
        return ApiResponse.ok("Dashboard admin berhasil diambil", data);
    }
}