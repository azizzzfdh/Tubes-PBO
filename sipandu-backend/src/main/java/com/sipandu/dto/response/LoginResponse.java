package com.sipandu.dto.response;

public class LoginResponse {
    private Long id;
    private String nama;
    private String email;
    private String role;
    private String noHp;
    private String alamat;
    private String jabatan;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String nama, String email, String role) {
        this.id = id;
        this.nama = nama;
        this.email = email;
        this.role = role;
    }

    public LoginResponse(Long id, String nama, String email, String role, String noHp, String alamat, String jabatan) {
        this.id = id;
        this.nama = nama;
        this.email = email;
        this.role = role;
        this.noHp = noHp;
        this.alamat = alamat;
        this.jabatan = jabatan;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNoHp() {
        return noHp;
    }

    public void setNoHp(String noHp) {
        this.noHp = noHp;
    }

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    public String getJabatan() {
        return jabatan;
    }

    public void setJabatan(String jabatan) {
        this.jabatan = jabatan;
    }
}
