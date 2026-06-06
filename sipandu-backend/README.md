# SIPANDU Backend

SIPANDU adalah Sistem Pengaduan dan Layanan Administrasi Warga berbasis Java Spring Boot.

## Teknologi

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- MySQL
- Lombok
- Swagger UI

## Cara Menjalankan

1. Pastikan Java 17 dan Maven sudah terpasang.
2. Jalankan MySQL.
3. Buat database opsional:

```sql
CREATE DATABASE sipandu_db;
```

4. Sesuaikan konfigurasi database di:

```txt
src/main/resources/application.properties
```

5. Jalankan aplikasi:

```bash
mvn spring-boot:run
```

6. Buka Swagger UI:

```txt
http://localhost:8080/swagger-ui.html
```

## Endpoint Utama

- `GET /api/pengaduan`
- `GET /api/pengaduan/{id}`
- `POST /api/pengaduan`
- `PUT /api/pengaduan/{id}/status`
- `DELETE /api/pengaduan/{id}`
- `GET /api/masyarakat`
- `POST /api/masyarakat`
- `GET /api/kategori`
- `POST /api/kategori`
- `POST /api/pelayanan`
- `GET /api/pelayanan/{id}`
- `GET /api/riwayat/pelayanan/{idPelayanan}`
