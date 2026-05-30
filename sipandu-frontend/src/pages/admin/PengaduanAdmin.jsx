import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllPengaduan,
  updateStatusPengaduan,
  deletePengaduan,
} from "../../services/api";

function PengaduanAdmin() {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPengaduan = async () => {
    try {
      setLoading(true);

      const result = await getAllPengaduan();
      const dataPengaduan = Array.isArray(result) ? result : result?.data || [];

      setPengaduan(dataPengaduan);
    } catch (error) {
      console.error("Gagal mengambil data pengaduan:", error);
      alert(error.message || "Gagal mengambil data pengaduan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const getIdPengaduan = (item) => {
    return item?.idPengaduan || item?.id_pengaduan || item?.id;
  };

  const getStatus = (item) => {
    return item?.statusPengaduan || item?.status || "";
  };

  const getNamaWarga = (item) => {
    return (
      item?.namaWarga ||
      item?.namaMasyarakat ||
      item?.masyarakat?.nama ||
      item?.nama ||
      "-"
    );
  };

  const getKategori = (item) => {
    return (
      item?.namaKategori ||
      item?.kategori ||
      item?.kategoriLayanan?.namaKategori ||
      item?.kategoriLayanan?.nama ||
      "-"
    );
  };

  const formatStatus = (status) => {
    if (status === "MENUNGGU") return "Menunggu";
    if (status === "DIPROSES") return "Diproses";
    if (status === "SELESAI") return "Selesai";
    if (status === "DITOLAK") return "Ditolak";
    return status || "-";
  };

  const badgeClass = (status) => {
    if (status === "MENUNGGU") return "badge badge-yellow";
    if (status === "DIPROSES") return "badge badge-blue";
    if (status === "SELESAI") return "badge badge-green";
    if (status === "DITOLAK") return "badge badge-red";
    return "badge";
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    try {
      return new Date(tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return tanggal;
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!id) {
      alert("ID pengaduan tidak ditemukan");
      return;
    }

    const konfirmasi = window.confirm(
      `Yakin ingin mengubah status menjadi ${status}?`
    );

    if (!konfirmasi) return;

    try {
      const result = await updateStatusPengaduan(id, status);
      alert(result?.message || "Status berhasil diperbarui");
      fetchPengaduan();
    } catch (error) {
      console.error("Gagal update status:", error);
      alert(error.message || "Gagal mengubah status");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("ID pengaduan tidak ditemukan");
      return;
    }

    const konfirmasi = window.confirm("Yakin ingin menghapus pengaduan ini?");

    if (!konfirmasi) return;

    try {
      const result = await deletePengaduan(id);
      alert(result?.message || "Pengaduan berhasil dihapus");
      fetchPengaduan();
    } catch (error) {
      console.error("Gagal hapus pengaduan:", error);
      alert(error.message || "Gagal menghapus pengaduan");
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

          <Link className="menu-link active" to="/admin/pengaduan">
            <span>📄</span> Data Pengaduan
          </Link>

          <Link className="menu-link" to="/admin/masyarakat">
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
            <h1>Data Pengaduan</h1>
            <p>Kelola seluruh data pengaduan warga</p>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <h4>Admin Kecamatan</h4>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        <section className="card">
          <div className="card-header">
            <h2>Daftar Pengaduan Warga</h2>

            <button className="btn-outline" onClick={fetchPengaduan}>
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
                    <th>Nama Warga</th>
                    <th>Kategori</th>
                    <th>Judul</th>
                    <th>Isi</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {pengaduan.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        Belum ada data pengaduan
                      </td>
                    </tr>
                  ) : (
                    pengaduan.map((item, index) => {
                      const idPengaduan = getIdPengaduan(item);
                      const status = getStatus(item);

                      return (
                        <tr key={idPengaduan || index}>
                          <td>{index + 1}</td>
                          <td>{getNamaWarga(item)}</td>
                          <td>{getKategori(item)}</td>
                          <td>{item?.judul || "-"}</td>
                          <td>{item?.isiPengaduan || item?.isi || "-"}</td>
                          <td>
                            {formatTanggal(
                              item?.createdAt ||
                                item?.tanggalPengaduan ||
                                item?.tanggal ||
                                item?.created_at
                            )}
                          </td>
                          <td>
                            <span className={badgeClass(status)}>
                              {formatStatus(status)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-action btn-blue"
                                disabled={status === "DIPROSES"}
                                onClick={() =>
                                  handleUpdateStatus(idPengaduan, "DIPROSES")
                                }
                              >
                                Proses
                              </button>

                              <button
                                className="btn-action btn-green"
                                disabled={status === "SELESAI"}
                                onClick={() =>
                                  handleUpdateStatus(idPengaduan, "SELESAI")
                                }
                              >
                                Selesai
                              </button>

                              <button
                                className="btn-action btn-red"
                                disabled={status === "DITOLAK"}
                                onClick={() =>
                                  handleUpdateStatus(idPengaduan, "DITOLAK")
                                }
                              >
                                Tolak
                              </button>

                              <button
                                className="btn-action btn-dark"
                                onClick={() => handleDelete(idPengaduan)}
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

export default PengaduanAdmin;