import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { apiFetch, getAdminNotifications } from "../../services/api";
import {
  formatDateTime,
  formatStatus,
  getKategori,
  getNamaWarga,
  getStatus,
  getTanggal,
  normalizeText,
} from "../../utils/sipanduFormat";

function HistoryPage() {
  const [pengaduan, setPengaduan] = useState([]);
  const [pelayanan, setPelayanan] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      const [pengaduanRes, pelayananRes, notificationRes] = await Promise.allSettled([
        apiFetch("/pengaduan"),
        apiFetch("/pelayanan"),
        getAdminNotifications(),
      ]);

      const unwrap = (result) => {
        if (result.status !== "fulfilled") return [];
        return Array.isArray(result.value) ? result.value : result.value?.data || [];
      };

      setPengaduan(unwrap(pengaduanRes));
      setPelayanan(unwrap(pelayananRes));
      setNotifications(unwrap(notificationRes));
    } catch (error) {
      console.error("Gagal memuat history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const timeline = useMemo(() => {
    const rows = [];

    pengaduan.forEach((item) => {
      rows.push({
        type: "pengaduan",
        title: item?.judul || "Pengaduan warga",
        description: `${getNamaWarga(item)} mengirim pengaduan kategori ${getKategori(item)}.`,
        date: getTanggal(item),
        chips: [formatStatus(getStatus(item)), getKategori(item), getNamaWarga(item)],
      });
    });

    pelayanan.forEach((item) => {
      rows.push({
        type: "pelayanan",
        title: item?.judulPengaduan || item?.pengaduan?.judul || "Pelayanan diproses",
        description: item?.keterangan || "Admin membuat tindak lanjut pelayanan.",
        date: getTanggal(item),
        chips: [formatStatus(getStatus(item)), item?.namaMasyarakat || item?.namaWarga || "Warga"],
      });
    });

    notifications.forEach((item) => {
      rows.push({
        type: "notifikasi",
        title: item?.title || "Notifikasi admin",
        description: item?.message || "Ada aktivitas baru pada sistem.",
        date: item?.createdAt || item?.created_at,
        chips: [item?.dibaca ? "Dibaca" : "Belum dibaca"],
      });
    });

    const q = normalizeText(keyword);

    return rows
      .filter((item) => filter === "ALL" || item.type === filter)
      .filter((item) => {
        if (!q) return true;
        return [item.title, item.description, item.type, ...(item.chips || [])]
          .map(normalizeText)
          .join(" ")
          .includes(q);
      })
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [pengaduan, pelayanan, notifications, filter, keyword]);

  return (
    <AdminLayout
      title="History"
      description="Jejak data pengaduan, pelayanan, dan notifikasi admin dalam satu timeline."
      active="riwayat"
    >
      <section className="insight-grid">
        <div className="insight-box">
          <span>Total Aktivitas</span>
          <strong>{timeline.length}</strong>
          <small>Sesuai filter aktif</small>
        </div>
        <div className="insight-box">
          <span>Pengaduan</span>
          <strong>{pengaduan.length}</strong>
          <small>Riwayat laporan warga</small>
        </div>
        <div className="insight-box">
          <span>Pelayanan</span>
          <strong>{pelayanan.length}</strong>
          <small>Tindak lanjut admin</small>
        </div>
        <div className="insight-box">
          <span>Notifikasi</span>
          <strong>{notifications.length}</strong>
          <small>Aktivitas sistem</small>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Timeline History</h2>
          <button className="btn-outline" onClick={loadHistory} disabled={loading}>Refresh</button>
        </div>

        <div className="history-toolbar">
          <div className="segmented-tabs">
            <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>Semua</button>
            <button className={filter === "pengaduan" ? "active" : ""} onClick={() => setFilter("pengaduan")}>Pengaduan</button>
            <button className={filter === "pelayanan" ? "active" : ""} onClick={() => setFilter("pelayanan")}>Pelayanan</button>
            <button className={filter === "notifikasi" ? "active" : ""} onClick={() => setFilter("notifikasi")}>Notifikasi</button>
          </div>

          <input
            className="history-search-inline"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari history..."
          />
        </div>

        {loading ? (
          <p>Sedang memuat history...</p>
        ) : (
          <div className="history-list">
            {timeline.length === 0 ? (
              <p>Belum ada history sesuai filter.</p>
            ) : timeline.map((item, index) => (
              <article className="timeline-item" key={`${item.type}-${item.date}-${index}`}>
                <div className="timeline-item-time">{formatDateTime(item.date)}</div>
                <div className="timeline-item-body">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <div className="timeline-chip-row">
                    <span>{item.type.toUpperCase()}</span>
                    {item.chips.filter(Boolean).map((chip) => <span key={chip}>{chip}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default HistoryPage;
