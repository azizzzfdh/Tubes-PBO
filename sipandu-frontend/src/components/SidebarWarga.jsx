import React from "react";
import { NavLink } from "react-router-dom";

function SidebarWarga() {
  return (
    <aside className="sidebar sidebar-user">
      <div className="sidebar-brand">
        <div className="logo-box">🏛️</div>
        <h2>SIPANDU</h2>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/warga/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          <span>📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/warga/buat-pengaduan"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          <span>➕</span> Buat Pengaduan
        </NavLink>

        <NavLink
          to="/warga/riwayat"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          <span>📄</span> Pengaduan Saya
        </NavLink>

        <NavLink
          to="/warga/profil"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          <span>👤</span> Profil Saya
        </NavLink>

        <NavLink to="/login" className="menu-link logout">
          <span>🚪</span> Logout
        </NavLink>
      </nav>
    </aside>
  );
}

export default SidebarWarga;