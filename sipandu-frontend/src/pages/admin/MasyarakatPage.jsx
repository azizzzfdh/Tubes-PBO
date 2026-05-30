import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";

function MasyarakatPage() {
  const [masyarakat, setMasyarakat] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMasyarakat = async () => {
    try {
      setLoading(true);

      const result = await apiFetch("/masyarakat");

      const dataMasyarakat = Array.isArray(result)
        ? result
        : result?.data || [];

      setMasyarakat(dataMasyarakat);
    } catch (error) {
      console.error("Gagal mengambil data masyarakat:", error);
      alert(error.message || "Gagal mengambil data masyarakat dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasyarakat();
  }, []);

  const getIdMasyarakat = (item) => {
    return item?.idMasyarakat || item?.id_masyarakat || item?.id;
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("ID masyarakat tidak ditemukan");
      return;
    }

    const konfirmasi = window.confirm(
      "Yakin ingin menghapus data masyarakat ini?"
    );

    if (!konfirmasi) return;

    try {
      const result = await apiFetch(`/masyarakat/${id}`, {
        method: "DELETE",
      });

      alert(result?.message || "Data masyarakat berhasil dihapus");

      fetchMasyarakat();
    } catch (error) {
      console.error("Gagal menghapus data masyarakat:", error);
      alert(error.message || "Gagal menghapus data masyarakat");
    }
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

          <Link className="menu-link active" to="/admin/masyarakat">
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

          <Link className="menu-link" to="/admin/profil">
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
            <h1>Data Masyarakat</h1>
            <p>Kelola data warga yang terdaftar pada sistem SIPANDU</p>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <h4>Admin Kecamatan</h4>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        <section className="stat-row stat-row-user">
          <div className="stat-card">
            <div className="stat-icon icon-blue">👥</div>
            <div>
              <p>Total Masyarakat</p>
              <h2>{masyarakat.length}</h2>
              <small>Warga terdaftar</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">✅</div>
            <div>
              <p>Status</p>
              <h2>Aktif</h2>
              <small>Data dapat dikelola</small>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Daftar Masyarakat</h2>

            <button className="btn-outline" onClick={fetchMasyarakat}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Sedang memuat data...</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No HP</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {masyarakat.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        Belum ada data masyarakat
                      </td>
                    </tr>
                  ) : (
                    masyarakat.map((item, index) => {
                      const idMasyarakat = getIdMasyarakat(item);

                      return (
                        <tr key={idMasyarakat || index}>
                          <td>{index + 1}</td>
                          <td>{item?.nama || item?.namaMasyarakat || "-"}</td>
                          <td>{item?.email || "-"}</td>
                          <td>{item?.noHp || item?.no_hp || item?.noHP || "-"}</td>
                          <td>{item?.alamat || "-"}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-action btn-blue">
                                Detail
                              </button>

                              <button
                                className="btn-action btn-dark"
                                onClick={() => handleDelete(idMasyarakat)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MasyarakatPage;