import React from "react";
import { Link } from "react-router-dom";

function ProfilAdminPage() {
  const admin = {
    nama: "Admin Kecamatan",
    role: "Administrator",
    email: "admin@sipandu.local",
    wilayah: "Kecamatan",
  };

  return (
    <div className="app-layout">
      <aside className="sidebar sidebar-admin">
        <div className="sidebar-brand">
          <div className="logo-box">🏛️</div>
          <h2>SIPANDU</h2>
        </div>

        <nav className="sidebar-menu">
          <Link className="menu-link" to="/admin/dashboard">
            <span>📊</span> Dashboard
          </Link>

          <Link className="menu-link" to="/admin/pengaduan">
            <span>📄</span> Data Pengaduan
          </Link>

          <Link className="menu-link" to="/admin/masyarakat">
            <span>👥</span> Data Masyarakat
          </Link>

          <Link className="menu-link" to="/admin/kategori">
            <span>🗂️</span> Kategori Layanan
          </Link>

          <Link className="menu-link" to="/admin/pelayanan">
            <span>✅</span> Pelayanan
          </Link>

          <Link className="menu-link" to="/admin/riwayat">
            <span>🕒</span> Riwayat Pelayanan
          </Link>

          <Link className="menu-link active" to="/admin/profil">
            <span>👤</span> Profil Admin
          </Link>

          <Link className="menu-link logout" to="/login">
            <span>🚪</span> Logout
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="topbar topbar-admin">
          <div className="topbar-left">
            <h1>Profil Admin</h1>
            <p>Informasi akun admin sistem SIPANDU</p>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <h4>{admin.nama}</h4>
              <p>{admin.role}</p>
            </div>
          </div>
        </header>

        <section className="card">
          <div className="card-header">
            <h2>Informasi Profil</h2>
          </div>

          <div className="profile-detail">
            <div className="profile-avatar-large">A</div>

            <div className="profile-info-list">
              <div>
                <span>Nama</span>
                <strong>{admin.nama}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>{admin.role}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{admin.email}</strong>
              </div>

              <div>
                <span>Wilayah</span>
                <strong>{admin.wilayah}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilAdminPage;