import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";

function KategoriPage() {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [namaKategori, setNamaKategori] = useState("");

  const fetchKategori = async () => {
    try {
      setLoading(true);

      const result = await apiFetch("/kategori");
      const dataKategori = Array.isArray(result) ? result : result?.data || [];

      setKategori(dataKategori);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
      alert(error.message || "Gagal mengambil data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const getIdKategori = (item) => {
    return item?.idKategori || item?.id_kategori || item?.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaKategori.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    try {
      const payload = {
        namaKategori: namaKategori.trim(),
      };

      const result = await apiFetch("/kategori", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(result?.message || "Kategori berhasil ditambahkan");

      setNamaKategori("");
      fetchKategori();
    } catch (error) {
      console.error("Gagal tambah kategori:", error);
      alert(error.message || "Gagal menambahkan kategori");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("ID kategori tidak ditemukan");
      return;
    }

    const konfirmasi = window.confirm("Yakin ingin menghapus kategori ini?");

    if (!konfirmasi) return;

    try {
      const result = await apiFetch(`/kategori/${id}`, {
        method: "DELETE",
      });

      alert(result?.message || "Kategori berhasil dihapus");

      fetchKategori();
    } catch (error) {
      console.error("Gagal hapus kategori:", error);
      alert(error.message || "Gagal menghapus kategori");
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

          <Link className="menu-link" to="/admin/masyarakat">
            <span>👥</span> Data Masyarakat
          </Link>

          <Link className="menu-link active" to="/admin/kategori">
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
            <h1>Kategori Layanan</h1>
            <p>Kelola kategori layanan pengaduan warga</p>
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
            <div className="stat-icon icon-blue">🗂️</div>
            <div>
              <p>Total Kategori</p>
              <h2>{kategori.length}</h2>
              <small>Kategori layanan</small>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Tambah Kategori</h2>
          </div>

          <form onSubmit={handleSubmit} className="form-modern">
            <div className="form-group">
              <label>Nama Kategori</label>
              <input
                type="text"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                placeholder="Contoh: Infrastruktur"
              />
            </div>

            <div className="form-action">
              <button type="submit" className="btn-primary btn-admin">
                Simpan Kategori
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Data Kategori Layanan</h2>

            <button className="btn-outline" onClick={fetchKategori}>
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
                    <th>Nama Kategori</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {kategori.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        Belum ada data kategori
                      </td>
                    </tr>
                  ) : (
                    kategori.map((item, index) => {
                      const idKategori = getIdKategori(item);

                      return (
                        <tr key={idKategori || index}>
                          <td>{index + 1}</td>
                          <td>{item?.namaKategori || item?.nama_kategori || "-"}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-action btn-dark"
                                onClick={() => handleDelete(idKategori)}
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

export default KategoriPage;