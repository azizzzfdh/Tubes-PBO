export const STATUS_META = {
  MENUNGGU: { label: "Menunggu", badge: "badge badge-yellow" },
  DIPROSES: { label: "Diproses", badge: "badge badge-blue" },
  SELESAI: { label: "Selesai", badge: "badge badge-green" },
  DITOLAK: { label: "Ditolak", badge: "badge badge-red" },
};

export function getIdPengaduan(item) {
  return item?.idPengaduan || item?.id_pengaduan || item?.id;
}

export function getStatus(item) {
  return item?.statusPengaduan || item?.statusPelayanan || item?.status || "";
}

export function formatStatus(status) {
  return STATUS_META[status]?.label || status || "-";
}

export function badgeClass(status) {
  return STATUS_META[status]?.badge || "badge";
}

export function getNamaWarga(item) {
  return (
    item?.namaWarga ||
    item?.namaMasyarakat ||
    item?.masyarakat?.nama ||
    item?.pengaduan?.masyarakat?.nama ||
    item?.nama ||
    "-"
  );
}

export function getKategori(item) {
  return (
    item?.namaKategori ||
    item?.kategori ||
    item?.kategoriLayanan?.namaKategori ||
    item?.kategoriLayanan?.nama ||
    item?.pengaduan?.kategoriLayanan?.namaKategori ||
    "-"
  );
}

export function getJudulPengaduan(item) {
  return item?.judulPengaduan || item?.pengaduan?.judul || item?.judul || "-";
}

export function getTanggal(item) {
  return (
    item?.tanggalProses ||
    item?.tanggalPengaduan ||
    item?.createdAt ||
    item?.created_at ||
    item?.tanggal ||
    ""
  );
}

export function formatTanggal(value, options = {}) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: options.short ? "short" : "long",
      year: "numeric",
    });
  } catch (error) {
    return value;
  }
}

export function formatDateTime(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return value;
  }
}

export function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

export function countByStatus(items, status) {
  return items.filter((item) => getStatus(item) === status).length;
}

export function sortByNewest(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(getTanggal(a) || 0).getTime();
    const dateB = new Date(getTanggal(b) || 0).getTime();
    return dateB - dateA;
  });
}

export function groupCount(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item) || "Lainnya";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export function toPercent(value, total) {
  if (!total) return 0;
  return Math.round((Number(value || 0) / total) * 100);
}
