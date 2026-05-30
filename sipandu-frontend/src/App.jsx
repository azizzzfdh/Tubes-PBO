import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import PengaduanAdmin from "./pages/admin/PengaduanAdmin";
import MasyarakatPage from "./pages/admin/MasyarakatPage";
import KategoriPage from "./pages/admin/KategoriPage";
import PelayananPage from "./pages/admin/PelayananPage";
import RiwayatPelayananPage from "./pages/admin/RiwayatPelayananPage";
import ProfilAdminPage from "./pages/admin/ProfilAdminPage";

import DashboardWarga from "./pages/warga/DashboardWarga";
import BuatPengaduanPage from "./pages/warga/BuatPengaduanPage";
import RiwayatPengaduanPage from "./pages/warga/RiwayatPengaduanPage";
import ProfilWargaPage from "./pages/warga/ProfilWargaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pengaduan"
          element={
            <ProtectedRoute role="ADMIN">
              <PengaduanAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/masyarakat"
          element={
            <ProtectedRoute role="ADMIN">
              <MasyarakatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/kategori"
          element={
            <ProtectedRoute role="ADMIN">
              <KategoriPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pelayanan"
          element={
            <ProtectedRoute role="ADMIN">
              <PelayananPage />
            </ProtectedRoute>
          }
        />

        {/* WARGA */}
        <Route
          path="/warga/dashboard"
          element={
            <ProtectedRoute role="MASYARAKAT">
              <DashboardWarga />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warga/buat-pengaduan"
          element={
            <ProtectedRoute role="MASYARAKAT">
              <BuatPengaduanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warga/riwayat"
          element={
            <ProtectedRoute role="MASYARAKAT">
              <RiwayatPengaduanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warga/profil"
          element={
            <ProtectedRoute role="MASYARAKAT">
              <ProfilWargaPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/riwayat"
  element={
    <ProtectedRoute role="ADMIN">
      <RiwayatPelayananPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/profil"
  element={
    <ProtectedRoute role="ADMIN">
      <ProfilAdminPage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;