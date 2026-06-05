import React, { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function PelayananPage() {
  const [pelayanan, setPelayanan] = useState([]);
  const [pengaduanList, setPengaduanList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    idPengaduan: "",
    keterangan: "",
    statusPelayanan: "DIPROSES",
    tanggalProses: "",
  });

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

  const fetchPelayanan = async () => {
    try {
      setLoading(true);

      const result = await apiFetch("/pelayanan");
      const dataPelayanan = Array.isArray(result) ? result : result?.data || [];

      setPelayanan(dataPelayanan);
    } catch (error) {
      console.error("Gagal mengambil data pelayanan:", error);
      setPelayanan([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPengaduan = async () => {
    try {
      const result = await apiFetch("/pengaduan");
      const dataPengaduan = Array.isArray(result) ? result : result?.data || [];

      setPengaduanList(dataPengaduan);
    } catch (error) {
      console.error("Gagal mengambil data pengaduan:", error);
    }
  };

  useEffect(() => {
    fetchPelayanan();
    fetchPengaduan();
  }, []);

  const getIdPelayanan = (item) => {
    return item?.idPelayanan || item?.id_pelayanan || item?.id;
  };

  const getStatus = (item) => {
    return item?.statusPelayanan || item?.status_pelayanan || item?.status || "";
  };

  const getJudulPengaduan = (item) => {
    return item?.judulPengaduan || item?.pengaduan?.judul || item?.judul || "-";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      idPengaduan: "",
      keterangan: "",
      statusPelayanan: "DIPROSES",
      tanggalProses: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.idPengaduan) {
      showToast("error", "Pengaduan wajib dipilih");
      return;
    }

    if (!form.keterangan.trim()) {
      showToast("error", "Keterangan pelayanan wajib diisi");
      return;
    }

    try {
      const payload = {
        idPengaduan: Number(form.idPengaduan),
        idAdmin: 1,
        keterangan: form.keterangan.trim(),
        statusPelayanan: form.statusPelayanan,
      };

      const result = await apiFetch("/pelayanan", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showToast(
        "success",
        result?.message || "Data pelayanan berhasil ditambahkan"
      );

      resetForm();
      setShowForm(false);
      fetchPelayanan();
    } catch (error) {
      console.error("Gagal menambahkan pelayanan:", error);
      showToast("error", error.message || "Gagal menambahkan pelayanan");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showToast("error", "ID pelayanan tidak ditemukan");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Hapus Data Pelayanan",
      message: "Yakin ingin menghapus data pelayanan ini?",
      action: async () => {
        try {
          const result = await apiFetch(`/pelayanan/${id}`, {
            method: "DELETE",
          });

          showToast(
            "success",
            result?.message || "Data pelayanan berhasil dihapus"
          );

          fetchPelayanan();
        } catch (error) {
          console.error("Gagal menghapus pelayanan:", error);
          showToast("error", error.message || "Gagal menghapus pelayanan");
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

  const total = pelayanan.length;

  const diproses = pelayanan.filter(
    (item) => getStatus(item) === "DIPROSES"
  ).length;

  const selesai = pelayanan.filter(
    (item) => getStatus(item) === "SELESAI"
  ).length;

  return (
    <>
      <AdminLayout
        title="Data Pelayanan"
        description="Kelola tindak lanjut pelayanan dari pengaduan warga"
        active="pelayanan"
      >
        <section className="stat-row stat-row-admin">
          <div className="stat-card">
            <div className="stat-icon icon-blue">✓</div>
            <div>
              <p>Total Pelayanan</p>
              <h2>{total}</h2>
              <small>Semua layanan</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-yellow">⚙</div>
            <div>
              <p>Diproses</p>
              <h2>{diproses}</h2>
              <small>Sedang ditindaklanjuti</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">✓</div>
            <div>
              <p>Selesai</p>
              <h2>{selesai}</h2>
              <small>Sudah selesai</small>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Daftar Pelayanan</h2>

            <div className="action-buttons">
              <button
                className="btn-outline"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Tutup Form" : "+ Tambah Pelayanan"}
              </button>

              <button className="btn-outline" onClick={fetchPelayanan}>
                Refresh
              </button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="form-modern">
              <div className="form-group">
                <label>Pilih Pengaduan</label>
                <select
                  name="idPengaduan"
                  value={form.idPengaduan}
                  onChange={handleChange}
                >
                  <option value="">Pilih pengaduan</option>
                  {pengaduanList.map((item) => (
                    <option
                      key={item.idPengaduan || item.id_pengaduan || item.id}
                      value={item.idPengaduan || item.id_pengaduan || item.id}
                    >
                      {item.judul || "Pengaduan tanpa judul"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status Pelayanan</label>
                <select
                  name="statusPelayanan"
                  value={form.statusPelayanan}
                  onChange={handleChange}
                >
                  <option value="DIPROSES">Diproses</option>
                  <option value="SELESAI">Selesai</option>
                  <option value="DITOLAK">Ditolak</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tanggal Proses</label>
                <input
                  type="date"
                  name="tanggalProses"
                  value={form.tanggalProses}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Keterangan</label>
                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  placeholder="Masukkan keterangan pelayanan..."
                />
              </div>

              <div className="form-action">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Batal
                </button>

                <button type="submit" className="btn-primary btn-admin">
                  Simpan Pelayanan
                </button>
              </div>
            </form>
          )}

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
                    <th>Tanggal Proses</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {pelayanan.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        Belum ada data pelayanan
                      </td>
                    </tr>
                  ) : (
                    pelayanan.map((item, index) => {
                      const idPelayanan = getIdPelayanan(item);
                      const status = getStatus(item);

                      return (
                        <tr key={idPelayanan || index}>
                          <td>{index + 1}</td>
                          <td>{getNamaWarga(item)}</td>
                          <td>{getJudulPengaduan(item)}</td>
                          <td>{item?.keterangan || "-"}</td>
                          <td>
                            {formatTanggal(
                              item?.tanggalProses ||
                                item?.tanggal_proses ||
                                item?.createdAt ||
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
                              <button className="btn-action btn-blue">
                                Detail
                              </button>

                              <button
                                className="btn-action btn-dark"
                                onClick={() => handleDelete(idPelayanan)}
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

export default PelayananPage;