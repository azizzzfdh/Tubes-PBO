import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../services/auth";

const wargaMenuItems = [
  { label: "Dashboard", to: "/warga/dashboard", icon: "📊", hint: "Ringkasan" },
  { label: "Buat Pengaduan", to: "/warga/buat-pengaduan", icon: "➕", hint: "Kirim laporan" },
  { label: "Pengaduan Saya", to: "/warga/riwayat", icon: "📄", hint: "Riwayat" },
  { label: "Layanan KTP", to: "/warga/layanan-ktp", icon: "🪪", hint: "Administrasi" },
  { label: "Profil Saya", to: "/warga/profil", icon: "👤", hint: "Akun" },
];

function SidebarWarga() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sipandu-warga-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sipandu-warga-sidebar-collapsed", String(collapsed));
    document.body.classList.toggle("warga-sidebar-collapsed", collapsed);

    return () => {
      document.body.classList.remove("warga-sidebar-collapsed");
    };
  }, [collapsed]);

  useEffect(() => {
    const toggleSidebar = () => setCollapsed((current) => !current);

    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    window.addEventListener("sipandu-toggle-warga-sidebar", toggleSidebar);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("sipandu-toggle-warga-sidebar", toggleSidebar);
    };
  }, []);

  return (
    <aside className={`sidebar sidebar-user ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand sidebar-brand-pro">
        <div className="logo-box">🏛️</div>
        <div className="sidebar-brand-text">
          <h2>SIPANDU</h2>
          <p>Layanan Warga</p>
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <div className="warga-nav-status" title="Status sistem">
        <span></span>
        <strong>Sistem aktif</strong>
      </div>

      <nav className="sidebar-menu" aria-label="Navigasi warga">
        {wargaMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            data-tooltip={item.label}
            className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <small className="menu-hint">{item.hint}</small>
          </NavLink>
        ))}

        <NavLink to="/login" className="menu-link logout" onClick={logout} title="Logout">
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Logout</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default SidebarWarga;
