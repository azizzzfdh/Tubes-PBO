import React from "react";
import SidebarWarga from "../../components/SidebarWarga";
import { getUser } from "../../services/auth";

function ProfilWargaPage() {
  const user = getUser();

  const nama = user?.nama || "Warga";
  const email = user?.email || "-";
  const alamat = user?.alamat || "-";
  const noHp = user?.noHp || user?.no_hp || user?.noHP || "-";

  return (
    <div className="app-layout">
      <SidebarWarga />

      <main className="dashboard-main">
        <header className="topbar topbar-user">
          <div className="topbar-left">
            <h1>Profil Saya</h1>
            <p>Informasi akun masyarakat pada sistem SIPANDU</p>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">
              {nama ? nama.charAt(0).toUpperCase() : "W"}
            </div>

            <div className="user-info">
              <h4>{nama}</h4>
              <p>Masyarakat</p>
            </div>
          </div>
        </header>

        <section className="card">
          <div className="card-header">
            <h2>Informasi Profil</h2>
          </div>

          <div className="profile-detail">
            <div className="profile-avatar-large profile-avatar-user">
              {nama ? nama.charAt(0).toUpperCase() : "W"}
            </div>

            <div className="profile-info-list">
              <div>
                <span>Nama</span>
                <strong>{nama}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{email}</strong>
              </div>

              <div>
                <span>No HP</span>
                <strong>{noHp}</strong>
              </div>

              <div>
                <span>Alamat</span>
                <strong>{alamat}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>Masyarakat</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilWargaPage;