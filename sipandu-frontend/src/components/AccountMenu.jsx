import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth";
import "./AccountMenu.css";

function AccountMenu({ role = "ADMIN", variant = "dark" }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const user = getUser();
  const isAdmin = role === "ADMIN" || user?.role === "ADMIN";
  const name = user?.nama || (isAdmin ? "Admin Kecamatan" : "Warga");
  const email = user?.email || "-";
  const initial = name ? name.charAt(0).toUpperCase() : isAdmin ? "A" : "W";
  const profilePath = isAdmin ? "/admin/profil" : "/warga/profil";
  const filledProfileFields = [user?.nama, user?.email, user?.noHp || user?.no_hp, user?.alamat || user?.jabatan].filter(Boolean).length;
  const profileScore = Math.min(100, Math.round((filledProfileFields / 4) * 100));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quickLinks = isAdmin
    ? [
        { label: "Data Pengaduan", to: "/admin/pengaduan", hint: "Proses, selesai, tolak" },
        { label: "Data Masyarakat", to: "/admin/masyarakat", hint: "Lihat dan kelola warga" },
        { label: "Kategori Layanan", to: "/admin/kategori", hint: "Tambah atau hapus kategori" },
        { label: "Pelayanan", to: "/admin/pelayanan", hint: "Buat tindak lanjut" },
      ]
    : [
        { label: "Buat Pengaduan", to: "/warga/buat-pengaduan", hint: "Create pengaduan" },
        { label: "Pengaduan Saya", to: "/warga/riwayat", hint: "Read riwayat" },
        { label: "Layanan KTP", to: "/warga/layanan-ktp", hint: "Ajukan layanan" },
        { label: "Edit Profil", to: "/warga/profil", hint: "Update data akun" },
      ];

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        type="button"
        className={`account-trigger account-trigger-${variant}`}
        onClick={() => setOpen((current) => !current)}
        aria-label="Buka menu akun"
      >
        <span>{initial}</span>
      </button>

      {open && (
        <div className="account-dropdown">
          <div className="account-card-head">
            <div className="account-card-avatar">{initial}</div>
            <div>
              <strong>{name}</strong>
              <small>{email}</small>
              <em>{isAdmin ? "Administrator" : "Masyarakat"}</em>
            </div>
          </div>

          <div className="account-health-card">
            <div>
              <strong>Kelengkapan Profil</strong>
              <small>{profileScore}% siap digunakan</small>
            </div>
            <div className="account-health-track"><span style={{ width: `${profileScore}%` }}></span></div>
          </div>

          <div className="account-actions-grid">
            <Link to={profilePath} onClick={() => setOpen(false)}>
              <strong>Read Profil</strong>
              <small>Lihat detail akun</small>
            </Link>

            <Link to={profilePath} onClick={() => setOpen(false)}>
              <strong>Update Profil</strong>
              <small>Edit nama, email, kontak</small>
            </Link>
          </div>

          <div className="account-crud-list">
            <p>Aksi cepat CRUD</p>
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </Link>
            ))}
          </div>

          <div className="account-session-note">
            <span></span> Sesi aktif · akses {isAdmin ? "admin" : "warga"}
          </div>

          <button type="button" className="account-logout-btn" onClick={handleLogout}>
            Logout dari SIPANDU
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
