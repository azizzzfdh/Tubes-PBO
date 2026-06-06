import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WargaLayout from "../../components/WargaLayout";
import { apiFetch } from "../../services/api";
import { getUser } from "../../services/auth";

function DashboardWarga() {
  const user = getUser();

  const [pengaduan, setPengaduan] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [judul, setJudul] = useState("");
  const [isiPengaduan, setIsiPengaduan] = useState("");
  const [idKategori, setIdKategori] = useState("");

  const fetchPengaduan = async () => {
    try {
      setLoading(true);

      let result;

      try {
        result = await apiFetch(`/pengaduan/masyarakat/${user?.id}`);
      } catch (endpointError) {
        result = await apiFetch("/pengaduan");
      }

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
      console.error("Gagal mengambil pengaduan:", error);
      setPengaduan([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const result = await apiFetch("/kategori");
      const dataKategori = Array.isArray(result) ? result : result?.data || [];
      setKategoriList(dataKategori);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
      setKategoriList([]);
    }
  };

  useEffect(() => {
    fetchPengaduan();
    fetchKategori();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul.trim()) {
      alert("Judul pengaduan wajib diisi");
      return;
    }

    if (!isiPengaduan.trim()) {
      alert("Isi pengaduan wajib diisi");
      return;
    }

    if (!idKategori) {
      alert("Kategori wajib dipilih");
      return;
    }

    try {
      const payload = {
        idMasyarakat: user?.id || 1,
        idKategori: Number(idKategori),
        judul: judul.trim(),
        isiPengaduan: isiPengaduan.trim(),
      };

      const result = await apiFetch("/pengaduan", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(result?.message || "Pengaduan berhasil dikirim");

      setJudul("");
      setIsiPengaduan("");
      setIdKategori("");

      fetchPengaduan();
    } catch (error) {
      console.error("Gagal mengirim pengaduan:", error);
      alert(error.message || "Gagal mengirim pengaduan");
    }
  };

  const total = pengaduan.length;
  const menunggu = pengaduan.filter((item) => getStatus(item) === "MENUNGGU").length;
  const diproses = pengaduan.filter((item) => getStatus(item) === "DIPROSES").length;
  const selesai = pengaduan.filter((item) => getStatus(item) === "SELESAI").length;

  return (
    <WargaLayout
      title="Dashboard Warga"
      description="Ajukan dan pantau status pengaduan Anda dari satu halaman layanan."
      active="dashboard"
      notificationCount={menunggu}
    >
        <section className="stat-row stat-row-user">
          <div className="stat-card">
            <div className="stat-icon icon-green">📄</div>
            <div>
              <p>Total Pengaduan Saya</p>
              <h2>{total}</h2>
              <small>Semua waktu</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-yellow">⏳</div>
            <div>
              <p>Menunggu</p>
              <h2>{menunggu}</h2>
              <small>Belum diproses</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-blue">⚙️</div>
            <div>
              <p>Diproses</p>
              <h2>{diproses}</h2>
              <small>Sedang ditindaklanjuti</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">✅</div>
            <div>
              <p>Selesai</p>
              <h2>{selesai}</h2>
              <small>Pengaduan selesai</small>
            </div>
          </div>
        </section>

        <section className="user-content-grid">
          <div className="card form-card">
            <Link to="/warga/buat-pengaduan">
              <button className="btn-primary btn-user">+ Buat Pengaduan</button>
            </Link>

            <Link to="/warga/layanan-ktp" className="quick-service-link">
              <div className="quick-service-card">
                <span>🪪</span>
                <div>
                  <strong>Layanan Pembuatan KTP</strong>
                  <small>Form khusus + bukti PDF</small>
                </div>
              </div>
            </Link>

            <h2>Form Pengaduan</h2>

            <form onSubmit={handleSubmit}>
              <label>Judul Pengaduan</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Jalan berlubang di depan rumah"
              />

              <label>Kategori Layanan</label>
              <select
                value={idKategori}
                onChange={(e) => setIdKategori(e.target.value)}
              >
                <option value="">Pilih kategori layanan</option>
                {kategoriList.map((item) => (
                  <option
                    key={item.idKategori || item.id}
                    value={item.idKategori || item.id}
                  >
                    {item.namaKategori || item.nama_kategori}
                  </option>
                ))}
              </select>

              <label>Isi Pengaduan</label>
              <textarea
                value={isiPengaduan}
                onChange={(e) => setIsiPengaduan(e.target.value)}
                placeholder="Tuliskan detail pengaduan Anda..."
              />

              <button type="submit" className="btn-primary btn-user">
                📨 Kirim Pengaduan
              </button>
            </form>
          </div>

          <div className="right-user-panel">
            <section className="card">
              <div className="card-header">
                <h2>Pengaduan Saya</h2>

                <Link to="/warga/riwayat">
                  <button className="btn-outline btn-outline-green">
                    Lihat Semua
                  </button>
                </Link>
              </div>

              {loading ? (
                <p>Sedang memuat data...</p>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pengaduan.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            Belum ada pengaduan
                          </td>
                        </tr>
                      ) : (
                        pengaduan.map((item, index) => {
                          const status = getStatus(item);

                          return (
                            <tr key={item.idPengaduan || item.id || index}>
                              <td>{item.judul || "-"}</td>
                              <td>{getKategori(item)}</td>
                              <td>
                                {formatTanggal(
                                  item.createdAt ||
                                    item.tanggalPengaduan ||
                                    item.tanggal ||
                                    item.created_at
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

            <section className="card timeline-card">
              <h2>Riwayat Status Pengaduan</h2>

              <div className="timeline">
                <div className="timeline-step">
                  <div className="timeline-circle circle-yellow">⏳</div>
                  <h4>MENUNGGU</h4>
                  <p>Pengaduan diterima</p>
                  <small>Menunggu admin</small>
                </div>

                <div className="timeline-line"></div>

                <div className="timeline-step">
                  <div className="timeline-circle circle-blue">⚙️</div>
                  <h4>DIPROSES</h4>
                  <p>Sedang ditindaklanjuti</p>
                  <small>Diproses admin</small>
                </div>

                <div className="timeline-line"></div>

                <div className="timeline-step">
                  <div className="timeline-circle circle-green">✅</div>
                  <h4>SELESAI</h4>
                  <p>Pengaduan selesai</p>
                  <small>Sudah ditangani</small>
                </div>
              </div>

              <div className="success-box">
                ✅ Terima kasih! Pengaduan Anda akan segera diproses oleh admin.
              </div>
            </section>
          </div>
        </section>
    </WargaLayout>
  );
}

export default DashboardWarga;