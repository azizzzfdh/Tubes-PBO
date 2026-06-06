import React, { useEffect, useState } from "react";
import {
  getAllPengaduan,
  updateStatusPengaduan,
  deletePengaduan,
} from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import { exportHtmlToPdf } from "../../utils/pdfExport";

function PengaduanAdmin() {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [modalLoading, setModalLoading] = useState(false);

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "success",
        message: "",
      });
    }, 2500);
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      action: null,
    });
  };

  const fetchPengaduan = async () => {
    try {
      setLoading(true);

      const result = await getAllPengaduan();
      const dataPengaduan = Array.isArray(result) ? result : result?.data || [];

      setPengaduan(dataPengaduan);
    } catch (error) {
      console.error("Gagal mengambil data pengaduan:", error);
      showToast("error", error.message || "Gagal mengambil data pengaduan");
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
      showToast("error", "ID pengaduan tidak ditemukan");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Ubah Status Pengaduan",
      message: `Yakin ingin mengubah status pengaduan menjadi ${formatStatus(
        status
      )}?`,
      action: async () => {
        try {
          const result = await updateStatusPengaduan(id, status);

          showToast(
            "success",
            result?.message || "Status pengaduan berhasil diperbarui"
          );

          fetchPengaduan();
        } catch (error) {
          console.error("Gagal update status:", error);
          showToast("error", error.message || "Gagal mengubah status");
        }
      },
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      showToast("error", "ID pengaduan tidak ditemukan");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Hapus Pengaduan",
      message: "Yakin ingin menghapus pengaduan ini?",
      action: async () => {
        try {
          const result = await deletePengaduan(id);

          showToast(
            "success",
            result?.message || "Pengaduan berhasil dihapus"
          );

          fetchPengaduan();
        } catch (error) {
          console.error("Gagal hapus pengaduan:", error);
          showToast("error", error.message || "Gagal menghapus pengaduan");
        }
      },
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.action) return;

    try {
      setModalLoading(true);
      await confirmModal.action();
      closeConfirmModal();
    } finally {
      setModalLoading(false);
    }
  };

  const handleExportPdf = () => {
    const menunggu = pengaduan.filter((item) => getStatus(item) === "MENUNGGU").length;
    const diproses = pengaduan.filter((item) => getStatus(item) === "DIPROSES").length;
    const selesai = pengaduan.filter((item) => getStatus(item) === "SELESAI").length;
    const ditolak = pengaduan.filter((item) => getStatus(item) === "DITOLAK").length;

    exportHtmlToPdf({
      title: "Laporan Data Pengaduan Warga",
      subtitle: "Rekap seluruh pengaduan warga berdasarkan data yang tampil di panel admin SIPANDU.",
      summary: [
        { label: "Total", value: pengaduan.length },
        { label: "Menunggu", value: menunggu },
        { label: "Diproses", value: diproses },
        { label: "Selesai", value: selesai },
      ],
      columns: ["No", "Nama Warga", "Kategori", "Judul", "Isi", "Tanggal", "Status"],
      rows: pengaduan.map((item, index) => [
        index + 1,
        getNamaWarga(item),
        getKategori(item),
        item?.judul || "-",
        item?.isiPengaduan || item?.isi || "-",
        formatTanggal(item?.createdAt || item?.tanggalPengaduan || item?.tanggal || item?.created_at),
        formatStatus(getStatus(item)),
      ]),
      footer: `Total ditolak: ${ditolak}. Dokumen ini dibuat otomatis dari menu Data Pengaduan SIPANDU.`,
    });
  };

  return (
    <>
      <AdminLayout
        title="Data Pengaduan"
        description="Kelola seluruh data pengaduan warga"
        active="pengaduan"
      >
        <section className="card">
          <div className="card-header">
            <h2>Daftar Pengaduan Warga</h2>

            <div className="action-buttons">
              <button className="btn-outline" onClick={handleExportPdf} disabled={loading}>
                Export PDF
              </button>

              <button className="btn-outline" onClick={fetchPengaduan}>
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
      </AdminLayout>

      {confirmModal.open && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="modal-icon">!</div>

            <h3>{confirmModal.title}</h3>
            <p>{confirmModal.message}</p>

            <div className="modal-actions">
              <button
                className="modal-btn modal-cancel"
                onClick={closeConfirmModal}
                disabled={modalLoading}
              >
                Batal
              </button>

              <button
                className="modal-btn modal-confirm"
                onClick={handleConfirmAction}
                disabled={modalLoading}
              >
                {modalLoading ? "Memproses..." : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "!"}</span>
          <p>{toast.message}</p>
        </div>
      )}
    </>
  );
}

export default PengaduanAdmin;