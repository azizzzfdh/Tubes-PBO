import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AdminNotificationCenter from "./AdminNotificationCenter";
import AdminSearchBox from "./AdminSearchBox";
import AccountMenu from "./AccountMenu";
import { getUser, logout } from "../services/auth";
import "./AdminLayout.css";

const menuItems = [
  { key: "dashboard", label: "Dashboard", to: "/admin/dashboard", icon: "▦", hint: "Ringkasan eksekutif" },
  { key: "pengaduan", label: "Data Pengaduan", to: "/admin/pengaduan", icon: "▤", hint: "Kelola laporan warga" },
  { key: "masyarakat", label: "Data Masyarakat", to: "/admin/masyarakat", icon: "◎", hint: "Master data warga" },
  { key: "kategori", label: "Kategori Layanan", to: "/admin/kategori", icon: "☷", hint: "Master kategori" },
  { key: "pelayanan", label: "Pelayanan", to: "/admin/pelayanan", icon: "✓", hint: "Tindak lanjut" },
  { key: "riwayat", label: "Riwayat Pelayanan", to: "/admin/riwayat", icon: "↻", hint: "Audit layanan" },
  { key: "profil", label: "Profil Admin", to: "/admin/profil", icon: "○", hint: "Akun & akses" },
];

const miniTabs = [
  { label: "Executive Overview", to: "/admin/dashboard" },
  { label: "Reports", to: "/admin/reports" },
  { label: "History", to: "/admin/history" },
  { label: "Activity", to: "/admin/activity" },
];

function AdminLayout({ title, description, active, children }) {
  const location = useLocation();
  const user = getUser();
  const adminName = user?.nama || "Admin Kecamatan";
  const adminRole = user?.jabatan || "Administrator";
  const initial = adminName ? adminName.charAt(0).toUpperCase() : "A";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sipandu-admin-sidebar-collapsed") === "true";
  });
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("sipandu-admin-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setSidebarCollapsed((current) => !current);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const currentSection = useMemo(() => {
    const path = location.pathname;
    return (
      [...menuItems, ...miniTabs].find((item) => item.to === path)?.label ||
      title ||
      "Dashboard"
    );
  }, [location.pathname, title]);

  const formattedClock = clock.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "admin-sidebar-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-logo">S</div>

          <div className="admin-brand-copy">
            <h2>SIPANDU</h2>
            <p>Citizen Service System</p>
          </div>

          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? "Buka sidebar" : "Tutup sidebar"}
            title={sidebarCollapsed ? "Buka sidebar" : "Tutup sidebar"}
          >
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="admin-sidebar-menu" aria-label="Navigasi admin">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              title={item.label}
              data-tooltip={item.label}
              className={`admin-menu-link ${active === item.key ? "active" : ""}`}
            >
              <span className="admin-menu-icon">{item.icon}</span>
              <span className="admin-menu-label">{item.label}</span>
              
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="system-chip" title="Status sistem">
            <span></span>
            <strong>Sistem aktif</strong>
          </div>

          <Link to="/login" className="admin-menu-link logout" onClick={logout} title="Logout">
            <span className="admin-menu-icon">↩</span>
            <span className="admin-menu-label">Logout</span>
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-page-shell">
          <div className="admin-mini-nav">
            <div className="admin-mini-left">
              <button
                type="button"
                className="admin-shell-button"
                onClick={() => setSidebarCollapsed((current) => !current)}
                title="Tutup/buka sidebar (Ctrl+B)"
              >
                ☰
              </button>

              <div className="admin-mini-tabs">
                {miniTabs.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="admin-mini-actions">
              <AdminSearchBox />
              <AdminNotificationCenter />
              <AccountMenu role="ADMIN" />
            </div>
          </div>

          <div className="admin-context-bar">
            <div className="context-breadcrumb">
              <span>Admin Console</span>
              <strong>{currentSection}</strong>
            </div>

            <div className="context-metrics">
              <span><i></i> Online</span>
              <span>Update {formattedClock}</span>
              <kbd>Ctrl+B</kbd>
            </div>
          </div>

          <header className="admin-hero">
            <div className="admin-hero-copy">
              <span className="admin-eyebrow">SIPANDU ADMIN PANEL</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <div className="admin-hero-profile">
              <div className="admin-avatar">{initial}</div>

              <div>
                <h4>{adminName}</h4>
                <p>{adminRole || "Administrator"}</p>
              </div>
            </div>
          </header>

          <div className="admin-page-content">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
