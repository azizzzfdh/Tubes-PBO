import React from "react";
import AdminLayout from "../../components/AdminLayout";

function ProfilAdminPage() {
  const admin = {
    nama: "Admin Kecamatan",
    role: "Administrator",
    email: "admin@sipandu.local",
    wilayah: "Kecamatan",
  };

  return (
    <AdminLayout
      title="Profil Admin"
      description="Informasi akun admin sistem SIPANDU"
      active="profil"
    >
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
    </AdminLayout>
  );
}

export default ProfilAdminPage;