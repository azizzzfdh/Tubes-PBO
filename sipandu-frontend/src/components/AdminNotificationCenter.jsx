import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminNotifications,
  markAllAdminNotificationsAsRead,
  markAdminNotificationAsRead,
} from "../services/api";

function AdminNotificationCenter() {
  const navigate = useNavigate();
  const latestNotificationIdRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  const getId = (item) => item?.idNotification || item?.id_notifikasi || item?.id;

  const formatTime = (value) => {
    if (!value) return "Baru saja";

    try {
      return new Date(value).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return value;
    }
  };

  const loadNotifications = async ({ detectNew = false } = {}) => {
    try {
      setLoading(true);

      const result = await getAdminNotifications();
      const data = Array.isArray(result) ? result : result?.data || [];
      const latest = data[0] || null;
      const latestId = latest ? getId(latest) : null;
      const unread = data.filter((item) => !item?.dibaca).length;

      setNotifications(data);
      setUnreadCount(unread);

      if (latestId && latestNotificationIdRef.current === null) {
        latestNotificationIdRef.current = latestId;
        return;
      }

      if (
        detectNew &&
        latestId &&
        latestNotificationIdRef.current &&
        Number(latestId) > Number(latestNotificationIdRef.current) &&
        !latest?.dibaca
      ) {
        setLiveToast(latest);

        setTimeout(() => {
          setLiveToast(null);
        }, 4200);
      }

      if (latestId) {
        latestNotificationIdRef.current = latestId;
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications({ detectNew: true });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    const id = getId(notification);

    try {
      if (id && !notification?.dibaca) {
        await markAdminNotificationAsRead(id);
      }

      await loadNotifications();
      setOpen(false);

      if (notification?.idPengaduan) {
        navigate("/admin/pengaduan");
      }
    } catch (error) {
      console.error("Gagal membuka notifikasi:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAdminNotificationsAsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    }
  };

  return (
    <div className="admin-notification-wrapper">
      <button
        type="button"
        className={`admin-notification-button ${unreadCount > 0 ? "has-unread" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label="Buka notifikasi admin"
      >
        <span className="notification-bell">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="admin-notification-dropdown">
          <div className="notification-dropdown-header">
            <div>
              <h4>Notifikasi Admin</h4>
              <p>{unreadCount} belum dibaca</p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || loading}
            >
              Tandai dibaca
            </button>
          </div>

          <div className="notification-list">
            {loading && notifications.length === 0 ? (
              <div className="notification-empty">Memuat notifikasi...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">Belum ada notifikasi</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={getId(notification)}
                  type="button"
                  className={`notification-item ${!notification?.dibaca ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="notification-item-icon">!</span>

                  <span className="notification-item-copy">
                    <strong>{notification?.title || "Notifikasi"}</strong>
                    <small>{notification?.message || "Ada aktivitas baru"}</small>
                    <em>{formatTime(notification?.createdAt)}</em>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {liveToast && (
        <div className="admin-live-notification">
          <span>🔔</span>
          <div>
            <strong>{liveToast?.title || "Pengaduan Baru Masuk"}</strong>
            <p>{liveToast?.message || "Ada pengaduan baru dari warga."}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotificationCenter;
