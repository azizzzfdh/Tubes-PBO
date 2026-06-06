const LOCAL_API_URL = "http://localhost:8080/api";
const RAILWAY_API_URL = "https://tubes-pbo-production-ba64.up.railway.app/api";

const BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API_URL
    : RAILWAY_API_URL);

console.log("API BASE URL:", BASE_URL);

export default BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Terjadi kesalahan");
  }

  return data;
}

// =======================
// AUTH
// =======================

export async function login(payload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// =======================
// KATEGORI
// =======================

export async function getAllKategori() {
  return apiFetch("/kategori");
}

// =======================
// PENGADUAN
// =======================

export async function getAllPengaduan() {
  return apiFetch("/pengaduan");
}

export async function getPengaduanById(id) {
  return apiFetch(`/pengaduan/${id}`);
}

export async function getPengaduanByMasyarakat(idMasyarakat) {
  return apiFetch(`/pengaduan/masyarakat/${idMasyarakat}`);
}

export async function createPengaduan(payload) {
  return apiFetch("/pengaduan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateStatusPengaduan(id, statusPengaduan) {
  return apiFetch(`/pengaduan/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status: statusPengaduan,
    }),
  });
}

export async function deletePengaduan(id) {
  return apiFetch(`/pengaduan/${id}`, {
    method: "DELETE",
  });
}
// =======================
// NOTIFIKASI ADMIN
// =======================

export async function getAdminNotifications() {
  return apiFetch("/notifikasi-admin");
}

export async function getUnreadAdminNotifications() {
  return apiFetch("/notifikasi-admin/unread");
}

export async function getUnreadAdminNotificationCount() {
  return apiFetch("/notifikasi-admin/unread/count");
}

export async function markAdminNotificationAsRead(id) {
  return apiFetch(`/notifikasi-admin/${id}/read`, {
    method: "PUT",
  });
}

export async function markAllAdminNotificationsAsRead() {
  return apiFetch("/notifikasi-admin/read-all", {
    method: "PUT",
  });
}

// =======================
// PROFILE
// =======================

export async function getAdminById(id) {
  return apiFetch(`/admin/${id}`);
}

export async function updateAdminProfile(id, payload) {
  return apiFetch(`/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getMasyarakatById(id) {
  return apiFetch(`/masyarakat/${id}`);
}

export async function updateMasyarakatProfile(id, payload) {
  return apiFetch(`/masyarakat/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
