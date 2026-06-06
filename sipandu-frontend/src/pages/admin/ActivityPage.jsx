import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { apiFetch, getAdminNotifications } from "../../services/api";
import {
  countByStatus,
  formatDateTime,
  formatStatus,
  getKategori,
  getNamaWarga,
  getStatus,
  getTanggal,
} from "../../utils/sipanduFormat";

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function ActivityPage() {
  const [pengaduan, setPengaduan] = useState([]);
  const [pelayanan, setPelayanan] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadActivity = async () => {
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
      console.error("Gagal memuat activity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return undefined;

    const interval = setInterval(loadActivity, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const activities = useMemo(() => {
    const rows = [];

    notifications.forEach((item) => {
      rows.push({
        icon: "🔔",
        title: item?.title || "Notifikasi admin",
        description: item?.message || "Ada aktivitas baru pada sistem.",
        date: item?.createdAt || item?.created_at,
        tone: item?.dibaca ? "Dibaca" : "Belum dibaca",
      });
    });

    pengaduan.forEach((item) => {
      rows.push({
        icon: "▤",
        title: item?.judul || "Pengaduan warga",
        description: `${getNamaWarga(item)} • ${getKategori(item)} • ${formatStatus(getStatus(item))}`,
        date: getTanggal(item),
        tone: formatStatus(getStatus(item)),
      });
    });

    pelayanan.forEach((item) => {
      rows.push({
        icon: "✓",
        title: item?.judulPengaduan || item?.pengaduan?.judul || "Pelayanan",
        description: item?.keterangan || "Tindak lanjut pelayanan dibuat admin.",
        date: getTanggal(item),
        tone: formatStatus(getStatus(item)),
      });
    });

    return rows
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 14);
  }, [pengaduan, pelayanan, notifications]);

  const todayPengaduan = pengaduan.filter((item) => isToday(getTanggal(item))).length;
  const unreadNotification = notifications.filter((item) => !item?.dibaca).length;
  const urgentFollowUp = countByStatus(pengaduan, "MENUNGGU") + countByStatus(pengaduan, "DIPROSES");
  const todayPelayanan = pelayanan.filter((item) => isToday(getTanggal(item))).length;

  return (
    <AdminLayout
      title="Activity"
      description="Pantau aktivitas terbaru, notifikasi, dan pekerjaan yang perlu segera ditindaklanjuti."
      active="dashboard"
    >
      <section className="insight-grid">
        <div className="insight-box">
          <span>Pengaduan Hari Ini</span>
          <strong>{todayPengaduan}</strong>
          <small>Input warga terbaru</small>
        </div>
        <div className="insight-box">
          <span>Pelayanan Hari Ini</span>
          <strong>{todayPelayanan}</strong>
          <small>Tindak lanjut dibuat</small>
        </div>
        <div className="insight-box">
          <span>Butuh Follow-up</span>
          <strong>{urgentFollowUp}</strong>
          <small>Menunggu + diproses</small>
        </div>
        <div className="insight-box">
          <span>Notif Belum Dibaca</span>
          <strong>{unreadNotification}</strong>
          <small>Pusat notifikasi admin</small>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Live Activity Feed</h2>
          <div className="action-buttons">
            <button className="btn-outline" onClick={() => setAutoRefresh((current) => !current)}>
              Auto Refresh: {autoRefresh ? "ON" : "OFF"}
            </button>
            <button className="btn-outline" onClick={loadActivity} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="activity-toolbar">
          <p style={{ margin: 0, color: "#64748b", fontWeight: 800 }}>
            Data otomatis diperbarui setiap 10 detik saat auto refresh aktif.
          </p>
        </div>

        {loading && activities.length === 0 ? (
          <p>Sedang memuat aktivitas...</p>
        ) : (
          <div className="activity-list">
            {activities.length === 0 ? (
              <p>Belum ada aktivitas.</p>
            ) : activities.map((item, index) => (
              <article className="activity-card" key={`${item.title}-${item.date}-${index}`}>
                <div className="activity-icon">{item.icon}</div>
                <div className="activity-copy">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>{formatDateTime(item.date)} • {item.tone}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default ActivityPage;
