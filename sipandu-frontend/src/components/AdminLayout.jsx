import { Link } from "react-router-dom";
import "./AdminLayout.css";

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: "◼",
  },
  {
    key: "pengaduan",
    label: "Data Pengaduan",
    to: "/admin/pengaduan",
    icon: "▤",
  },
  {
    key: "masyarakat",
    label: "Data Masyarakat",
    to: "/admin/masyarakat",
    icon: "◉",
  },
  {
    key: "kategori",
    label: "Kategori Layanan",
    to: "/admin/kategori",
    icon: "☷",
  },
  {
    key: "pelayanan",
    label: "Pelayanan",
    to: "/admin/pelayanan",
    icon: "✓",
  },
  {
    key: "riwayat",
    label: "Riwayat Pelayanan",
    to: "/admin/riwayat",
    icon: "↻",
  },
  {
    key: "profil",
    label: "Profil Admin",
    to: "/admin/profil",
    icon: "○",
  },
];

function AdminLayout({ title, description, active, children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-logo">S</div>

          <div>
            <h2>SIPANDU</h2>
            <p>Citizen Service System</p>
          </div>
        </div>

        <nav className="admin-sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`admin-menu-link ${
                active === item.key ? "active" : ""
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="system-chip">
            <span></span>
            Sistem aktif
          </div>

          <Link to="/login" className="admin-menu-link logout">
            <span>↩</span>
            Logout
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-page-shell">
          <div className="admin-mini-nav">
            <div className="admin-mini-tabs">
              <span className="active">Executive Overview</span>
              <span>Reports</span>
              <span>History</span>
              <span>Activity</span>
            </div>

            <div className="admin-mini-actions">
              <div className="admin-search">Search...</div>
              <div className="admin-dot"></div>
              <div className="admin-avatar-small">A</div>
            </div>
          </div>

          <header className="admin-hero">
            <div className="admin-hero-copy">
              <span className="admin-eyebrow">SIPANDU ADMIN PANEL</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <div className="admin-hero-profile">
              <div className="admin-avatar">A</div>

              <div>
                <h4>Admin Kecamatan</h4>
                <p>Administrator</p>
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