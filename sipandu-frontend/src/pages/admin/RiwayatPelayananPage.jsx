import React, { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { exportHtmlToPdf } from "../../utils/pdfExport";

function RiwayatPelayananPage() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    try {
      setLoading(true);

      let result;

      try {
        result = await apiFetch("/riwayat-pelayanan");
      } catch (error) {
        try {
          result = await apiFetch("/pelayanan");
        } catch (error2) {
          result = { data: [] };
        }
      }

      const dataRiwayat = Array.isArray(result) ? result : result?.data || [];

      setRiwayat(dataRiwayat);
    } catch (error) {
      console.error("Gagal mengambil riwayat pelayanan:", error);
      setRiwayat([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const getStatus = (item) => {
    return item?.statusPelayanan || item?.statusPengaduan || item?.status || "";
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

  const getNamaWarga = (item) => {
    return (
      item?.namaWarga ||
      item?.pengaduan?.namaWarga ||
      item?.pengaduan?.masyarakat?.nama ||
      item?.masyarakat?.nama ||
      "-"
    );
  };

  const getJudulPengaduan = (item) => {
    return item?.judulPengaduan || item?.pengaduan?.judul || item?.judul || "-";
  };

  const handleExportPdf = () => {
    exportHtmlToPdf({
      title: "Laporan Riwayat Pelayanan",
      subtitle: "Rekap perubahan status dan tindak lanjut pelayanan warga di SIPANDU.",
      summary: [
        { label: "Total Riwayat", value: riwayat.length },
        { label: "Diproses", value: riwayat.filter((item) => getStatus(item) === "DIPROSES").length },
        { label: "Selesai", value: riwayat.filter((item) => getStatus(item) === "SELESAI").length },
        { label: "Ditolak", value: riwayat.filter((item) => getStatus(item) === "DITOLAK").length },
      ],
      columns: ["No", "Nama Warga", "Pengaduan", "Keterangan", "Tanggal", "Status"],
      rows: riwayat.map((item, index) => [
        index + 1,
        getNamaWarga(item),
        getJudulPengaduan(item),
        item?.keterangan || item?.catatan || "-",
        formatTanggal(item?.tanggalUpdate || item?.tanggalProses || item?.createdAt || item?.created_at),
        formatStatus(getStatus(item)),
      ]),
      footer: "Dokumen ini dibuat otomatis dari menu Riwayat Pelayanan SIPANDU.",
    });
  };

  return (
    <AdminLayout
      title="Riwayat Pelayanan"
      description="Lihat riwayat tindak lanjut pelayanan pengaduan warga"
      active="riwayat"
    >
      <section className="stat-row stat-row-admin">
        <div className="stat-card">
          <div className="stat-icon icon-blue">⟳</div>
          <div>
            <p>Total Riwayat</p>
            <h2>{riwayat.length}</h2>
            <small>Data pelayanan</small>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Daftar Riwayat Pelayanan</h2>

          <div className="action-buttons">
            <button className="btn-outline" onClick={handleExportPdf} disabled={loading}>
              Export PDF
            </button>

            <button className="btn-outline" onClick={fetchRiwayat}>
              Refresh
            </button>
          </div>
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
                  <th>Pengaduan</th>
                  <th>Keterangan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {riwayat.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Belum ada riwayat pelayanan
                    </td>
                  </tr>
                ) : (
                  riwayat.map((item, index) => {
                    const status = getStatus(item);

                    return (
                      <tr
                        key={
                          item?.idRiwayat ||
                          item?.idPelayanan ||
                          item?.id ||
                          index
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{getNamaWarga(item)}</td>
                        <td>{getJudulPengaduan(item)}</td>
                        <td>{item?.keterangan || item?.catatan || "-"}</td>
                        <td>
                          {formatTanggal(
                            item?.tanggalProses ||
                              item?.tanggalRiwayat ||
                              item?.createdAt ||
                              item?.updatedAt
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
    </AdminLayout>
  );
}

export default RiwayatPelayananPage;