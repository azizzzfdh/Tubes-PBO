import React, { useEffect, useState } from "react";
import SidebarWarga from "../../components/SidebarWarga";
import { apiFetch } from "../../services/api";
import { getUser } from "../../services/auth";

function RiwayatPengaduanPage() {
  const user = getUser();

  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPengaduan = async () => {
    try {
      setLoading(true);

      const result = await apiFetch("/pengaduan");
      const dataPengaduan = Array.isArray(result) ? result : result?.data || [];

      const dataUser = dataPengaduan.filter((item) => {
        const idMasyarakat =
          item?.idMasyarakat ||
          item?.masyarakat?.idMasyarakat ||
          item?.masyarakat?.id ||
          item?.id_masyarakat;

        return Number(idMasyarakat) === Number(user?.id);
      });

      setPengaduan(dataUser.length > 0 ? dataUser : dataPengaduan);
    } catch (error) {
      console.error("Gagal mengambil riwayat pengaduan:", error);
      setPengaduan([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const getStatus = (item) => {
    return item?.statusPengaduan || item?.status || "";
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

  const badgeClass = (status) => {
    if (status === "MENUNGGU") return "badge badge-yellow";
    if (status === "DIPROSES") return "badge badge-blue";
    if (status === "SELESAI") return "badge badge-green";
    if (status === "DITOLAK") return "badge badge-red";
    return "badge";
  };

  const formatStatus = (status) => {
    if (status === "MENUNGGU") return "Menunggu";
    if (status === "DIPROSES") return "Diproses";
    if (status === "SELESAI") return "Selesai";
    if (status === "DITOLAK") return "Ditolak";
    return status || "-";
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

  return (
    <div className="app-layout">
      <SidebarWarga />

      <main className="dashboard-main">
        <header className="topbar topbar-user">
          <div className="topbar-left">
            <h1>Pengaduan Saya</h1>
            <p>Lihat semua riwayat pengaduan yang pernah Anda kirim</p>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">
              {user?.nama ? user.nama.charAt(0).toUpperCase() : "W"}
            </div>

            <div className="user-info">
              <h4>{user?.nama || "Warga"}</h4>
              <p>Masyarakat</p>
            </div>
          </div>
        </header>

        <section className="stat-row stat-row-user">
          <div className="stat-card">
            <div className="stat-icon icon-green">📄</div>
            <div>
              <p>Total Pengaduan</p>
              <h2>{pengaduan.length}</h2>
              <small>Semua pengaduan saya</small>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Riwayat Pengaduan</h2>

            <button className="btn-outline btn-outline-green" onClick={fetchPengaduan}>
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
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Isi Pengaduan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {pengaduan.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        Belum ada pengaduan
                      </td>
                    </tr>
                  ) : (
                    pengaduan.map((item, index) => {
                      const status = getStatus(item);

                      return (
                        <tr key={item?.idPengaduan || item?.id || index}>
                          <td>{index + 1}</td>
                          <td>{item?.judul || "-"}</td>
                          <td>{getKategori(item)}</td>
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

export default RiwayatPengaduanPage;