const BASE_URL = "http://localhost:8080/api";

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
      statusPengaduan: statusPengaduan,
    }),
  });
}

export async function deletePengaduan(id) {
  return apiFetch(`/pengaduan/${id}`, {
    method: "DELETE",
  });
}