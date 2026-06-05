import React, { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function KategoriPage() {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [namaKategori, setNamaKategori] = useState("");

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

  const fetchKategori = async () => {
    try {
      setLoading(true);

      const result = await apiFetch("/kategori");
      const dataKategori = Array.isArray(result) ? result : result?.data || [];

      setKategori(dataKategori);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
      showToast("error", error.message || "Gagal mengambil data kategori");
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
      showToast("error", "Nama kategori wajib diisi");
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

      showToast("success", result?.message || "Kategori berhasil ditambahkan");

      setNamaKategori("");
      fetchKategori();
    } catch (error) {
      console.error("Gagal tambah kategori:", error);
      showToast("error", error.message || "Gagal menambahkan kategori");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showToast("error", "ID kategori tidak ditemukan");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Hapus Kategori",
      message: "Yakin ingin menghapus kategori ini?",
      action: async () => {
        try {
          const result = await apiFetch(`/kategori/${id}`, {
            method: "DELETE",
          });

          showToast("success", result?.message || "Kategori berhasil dihapus");

          fetchKategori();
        } catch (error) {
          console.error("Gagal hapus kategori:", error);
          showToast("error", error.message || "Gagal menghapus kategori");
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

  return (
    <>
      <AdminLayout
        title="Kategori Layanan"
        description="Kelola kategori layanan pengaduan warga"
        active="kategori"
      >
        <section className="stat-row stat-row-admin">
          <div className="stat-card">
            <div className="stat-icon icon-blue">☷</div>
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
                          <td>
                            {item?.namaKategori || item?.nama_kategori || "-"}
                          </td>
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

export default KategoriPage;