import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarWarga from "./SidebarWarga";
import AccountMenu from "./AccountMenu";
import WargaSearchBox from "./WargaSearchBox";
import { getUser } from "../services/auth";

const wargaTabs = [
  { key: "dashboard", label: "Overview", to: "/warga/dashboard" },
  { key: "buat", label: "Buat Pengaduan", to: "/warga/buat-pengaduan" },
  { key: "riwayat", label: "Riwayat", to: "/warga/riwayat" },
  { key: "ktp", label: "Layanan KTP", to: "/warga/layanan-ktp" },
  { key: "profil", label: "Profil", to: "/warga/profil" },
];

function WargaLayout({ title, description, active, notificationCount = 0, children }) {
  const location = useLocation();
  const user = getUser();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const currentSection = useMemo(() => {
    return wargaTabs.find((item) => item.to === location.pathname)?.label || title || "Dashboard";
  }, [location.pathname, title]);

  const formattedClock = clock.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const wargaName = user?.nama || "Warga";
  const initial = wargaName ? wargaName.charAt(0).toUpperCase() : "W";

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("sipandu-toggle-warga-sidebar"));
  };

  return (
    <div className="app-layout warga-layout">
      <SidebarWarga />

      <main className="dashboard-main warga-main">
        <div className="warga-page-shell">
          <div className="warga-mini-nav">
            <div className="warga-mini-left">
              <button
                type="button"
                className="warga-shell-button"
                onClick={toggleSidebar}
                title="Tutup/buka sidebar (Ctrl+B)"
              >
                ☰
              </button>

              <div className="warga-mini-tabs">
                {wargaTabs.map((tab) => (
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

            <div className="warga-mini-actions">
              <WargaSearchBox />
              <div className="warga-notif-pill" title="Pengaduan menunggu">
                <span>🔔</span>
                {notificationCount > 0 && <strong>{notificationCount}</strong>}
              </div>
              <AccountMenu role="MASYARAKAT" />
            </div>
          </div>

          <div className="warga-context-bar">
            <div className="context-breadcrumb">
              <span>Warga Portal</span>
              <strong>{currentSection}</strong>
            </div>

            <div className="context-metrics">
              <span><i></i> Online</span>
              <span>Update {formattedClock}</span>
              <kbd>Ctrl+B</kbd>
            </div>
          </div>

          <header className="warga-hero">
            <div className="warga-hero-copy">
              <span className="warga-eyebrow">SIPANDU WARGA SERVICE</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <div className="warga-hero-profile">
              <div className="warga-avatar">{initial}</div>
              <div>
                <h4>{wargaName}</h4>
                <p>Masyarakat</p>
              </div>
            </div>
          </header>

          <div className="warga-page-content">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default WargaLayout;
