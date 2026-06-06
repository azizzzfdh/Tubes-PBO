package com.sipandu.controller;

import com.sipandu.dto.response.AdminNotificationResponse;
import com.sipandu.dto.response.ApiResponse;
import com.sipandu.exception.ResourceNotFoundException;
import com.sipandu.model.AdminNotification;
import com.sipandu.repository.AdminNotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifikasi-admin")
@CrossOrigin(origins = "*")
public class AdminNotificationController {

    private final AdminNotificationRepository adminNotificationRepository;

    public AdminNotificationController(AdminNotificationRepository adminNotificationRepository) {
        this.adminNotificationRepository = adminNotificationRepository;
    }

    @GetMapping
    public ApiResponse<List<AdminNotificationResponse>> getLatest() {
        List<AdminNotificationResponse> notifications = adminNotificationRepository.findTop15ByOrderByCreatedAtDesc()
                .stream()
                .map(AdminNotificationResponse::from)
                .toList();

        return ApiResponse.ok("Data notifikasi admin berhasil diambil", notifications);
    }

    @GetMapping("/unread")
    public ApiResponse<List<AdminNotificationResponse>> getUnread() {
        List<AdminNotificationResponse> notifications = adminNotificationRepository.findByDibacaFalseOrderByCreatedAtDesc()
                .stream()
                .map(AdminNotificationResponse::from)
                .toList();

        return ApiResponse.ok("Data notifikasi belum dibaca berhasil diambil", notifications);
    }

    @GetMapping("/unread/count")
    public ApiResponse<Long> countUnread() {
        return ApiResponse.ok("Jumlah notifikasi belum dibaca berhasil diambil", adminNotificationRepository.countByDibacaFalse());
    }

    @PutMapping("/{id}/read")
    public ApiResponse<AdminNotificationResponse> markAsRead(@PathVariable Long id) {
        AdminNotification notification = adminNotificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notifikasi tidak ditemukan"));

        notification.setDibaca(true);
        AdminNotification saved = adminNotificationRepository.save(notification);

        return ApiResponse.ok("Notifikasi berhasil ditandai sudah dibaca", AdminNotificationResponse.from(saved));
    }

    @PutMapping("/read-all")
    public ApiResponse<String> markAllAsRead() {
        List<AdminNotification> notifications = adminNotificationRepository.findByDibacaFalseOrderByCreatedAtDesc();

        notifications.forEach(notification -> notification.setDibaca(true));
        adminNotificationRepository.saveAll(notifications);

        return ApiResponse.ok("Semua notifikasi berhasil ditandai sudah dibaca", "OK");
    }
}
