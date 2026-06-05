import React, { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

function MasyarakatPage() {
  const [masyarakat, setMasyarakat] = useState([]);
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

  const fetchMasyarakat = async () => {
    try {
      setLoading(true);

      const result = await apiFetch("/masyarakat");
      const dataMasyarakat = Array.isArray(result) ? result : result?.data || [];

      setMasyarakat(dataMasyarakat);
    } catch (error) {
      console.error("Gagal mengambil data masyarakat:", error);
      showToast(
        "error",
        error.message || "Gagal mengambil data masyarakat dari server"
      );
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
      showToast("error", "ID masyarakat tidak ditemukan");
      return;
    }

    setConfirmModal({
      open: true,
      title: "Hapus Data Masyarakat",
      message: "Yakin ingin menghapus data masyarakat ini?",
      action: async () => {
        try {
          const result = await apiFetch(`/masyarakat/${id}`, {
            method: "DELETE",
          });

          showToast(
            "success",
            result?.message || "Data masyarakat berhasil dihapus"
          );

          fetchMasyarakat();
        } catch (error) {
          console.error("Gagal menghapus data masyarakat:", error);
          showToast(
            "error",
            error.message || "Gagal menghapus data masyarakat"
          );
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
        title="Data Masyarakat"
        description="Kelola data warga yang terdaftar pada sistem SIPANDU"
        active="masyarakat"
      >
        <section className="stat-row stat-row-admin">
          <div className="stat-card">
            <div className="stat-icon icon-blue">◉</div>
            <div>
              <p>Total Masyarakat</p>
              <h2>{masyarakat.length}</h2>
              <small>Warga terdaftar</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">✓</div>
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
                          <td>
                            {item?.noHp || item?.no_hp || item?.noHP || "-"}
                          </td>
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

export default MasyarakatPage;