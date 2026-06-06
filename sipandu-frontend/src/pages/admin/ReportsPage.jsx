import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { apiFetch } from "../../services/api";
import { exportHtmlToPdf } from "../../utils/pdfExport";
import {
  badgeClass,
  countByStatus,
  formatStatus,
  formatTanggal,
  getKategori,
  getNamaWarga,
  getStatus,
  getTanggal,
  groupCount,
  normalizeText,
  sortByNewest,
  toPercent,
} from "../../utils/sipanduFormat";

function ReportsPage() {
  const [pengaduan, setPengaduan] = useState([]);
  const [pelayanan, setPelayanan] = useState([]);
  const [masyarakat, setMasyarakat] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "ALL",
    kategori: "ALL",
    keyword: "",
    bulan: "ALL",
  });

  const loadReports = async () => {
    try {
      setLoading(true);
      const [pengaduanRes, pelayananRes, masyarakatRes, kategoriRes] = await Promise.allSettled([
        apiFetch("/pengaduan"),
        apiFetch("/pelayanan"),
        apiFetch("/masyarakat"),
        apiFetch("/kategori"),
      ]);

      const unwrap = (result) => {
        if (result.status !== "fulfilled") return [];
        return Array.isArray(result.value) ? result.value : result.value?.data || [];
      };

      setPengaduan(unwrap(pengaduanRes));
      setPelayanan(unwrap(pelayananRes));
      setMasyarakat(unwrap(masyarakatRes));
      setKategori(unwrap(kategoriRes));
    } catch (error) {
      console.error("Gagal memuat report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const monthOptions = useMemo(() => {
    const months = new Map();

    pengaduan.forEach((item) => {
      const rawDate = getTanggal(item);
      if (!rawDate) return;
      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      months.set(key, label);
    });

    return Array.from(months.entries()).map(([value, label]) => ({ value, label }));
  }, [pengaduan]);

  const filteredPengaduan = useMemo(() => {
    const keyword = normalizeText(filters.keyword);

    return sortByNewest(pengaduan).filter((item) => {
      const status = getStatus(item);
      const kategoriName = getKategori(item);
      const rawDate = getTanggal(item);
      const date = rawDate ? new Date(rawDate) : null;
      const monthKey = date && !Number.isNaN(date.getTime())
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        : "";

      const matchesStatus = filters.status === "ALL" || status === filters.status;
      const matchesKategori = filters.kategori === "ALL" || kategoriName === filters.kategori;
      const matchesMonth = filters.bulan === "ALL" || monthKey === filters.bulan;
      const matchesKeyword = !keyword || [
        item?.judul,
        item?.isiPengaduan,
        item?.isi,
        getNamaWarga(item),
        kategoriName,
        formatStatus(status),
      ].map(normalizeText).join(" ").includes(keyword);

      return matchesStatus && matchesKategori && matchesMonth && matchesKeyword;
    });
  }, [pengaduan, filters]);

  const categoryBreakdown = useMemo(() => {
    const grouped = groupCount(filteredPengaduan, getKategori);
    return Object.entries(grouped)
      .map(([label, value]) => ({ label, value, percent: toPercent(value, filteredPengaduan.length) }))
      .sort((a, b) => b.value - a.value);
  }, [filteredPengaduan]);

  const completionRate = toPercent(countByStatus(pengaduan, "SELESAI"), pengaduan.length);
  const activeCases = countByStatus(pengaduan, "MENUNGGU") + countByStatus(pengaduan, "DIPROSES");

  const handleChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleExportPdf = () => {
    exportHtmlToPdf({
      title: "Executive Report SIPANDU",
      subtitle: "Laporan interaktif berdasarkan filter aktif pada menu Reports admin.",
      summary: [
        { label: "Total Pengaduan", value: pengaduan.length },
        { label: "Filter Aktif", value: filteredPengaduan.length },
        { label: "Tingkat Selesai", value: `${completionRate}%` },
        { label: "Warga Terdaftar", value: masyarakat.length },
      ],
      columns: ["No", "Nama Warga", "Kategori", "Judul", "Tanggal", "Status"],
      rows: filteredPengaduan.map((item, index) => [
        index + 1,
        getNamaWarga(item),
        getKategori(item),
        item?.judul || "-",
        formatTanggal(getTanggal(item)),
        formatStatus(getStatus(item)),
      ]),
      footer: "Dokumen ini dibuat otomatis dari halaman Reports SIPANDU.",
    });
  };

  return (
    <AdminLayout
      title="Reports"
      description="Ringkasan performa layanan, filter laporan, dan export PDF dari data SIPANDU."
      active="dashboard"
    >
      <section className="insight-grid">
        <div className="insight-box">
          <span>Total Pengaduan</span>
          <strong>{pengaduan.length}</strong>
          <small>Semua laporan warga</small>
        </div>
        <div className="insight-box">
          <span>Kasus Aktif</span>
          <strong>{activeCases}</strong>
          <small>Menunggu + diproses</small>
        </div>
        <div className="insight-box">
          <span>Tingkat Selesai</span>
          <strong>{completionRate}%</strong>
          <small>Pengaduan selesai</small>
        </div>
        <div className="insight-box">
          <span>Data Master</span>
          <strong>{masyarakat.length}/{kategori.length}</strong>
          <small>Warga / kategori</small>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Filter Report</h2>
          <div className="action-buttons">
            <button className="btn-outline" onClick={handleExportPdf} disabled={loading}>
              Export PDF
            </button>
            <button className="btn-outline" onClick={loadReports} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="filter-panel">
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleChange}>
              <option value="ALL">Semua status</option>
              <option value="MENUNGGU">Menunggu</option>
              <option value="DIPROSES">Diproses</option>
              <option value="SELESAI">Selesai</option>
              <option value="DITOLAK">Ditolak</option>
            </select>
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select name="kategori" value={filters.kategori} onChange={handleChange}>
              <option value="ALL">Semua kategori</option>
              {categoryBreakdown.map((item) => (
                <option key={item.label} value={item.label}>{item.label}</option>
              ))}
              {kategori
                .map((item) => item?.namaKategori || item?.nama_kategori)
                .filter(Boolean)
                .filter((item) => !categoryBreakdown.some((row) => row.label === item))
                .map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Bulan</label>
            <select name="bulan" value={filters.bulan} onChange={handleChange}>
              <option value="ALL">Semua bulan</option>
              {monthOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Kata kunci</label>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Cari warga, judul, isi..."
            />
          </div>
        </div>
      </section>

      <div className="report-grid">
        <section className="card">
          <div className="card-header">
            <h2>Data Report</h2>
            <span className="badge badge-blue">{filteredPengaduan.length} data</span>
          </div>

          {loading ? (
            <p>Sedang memuat laporan...</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Warga</th>
                    <th>Kategori</th>
                    <th>Judul</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPengaduan.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: "center" }}>Tidak ada data sesuai filter</td></tr>
                  ) : filteredPengaduan.map((item, index) => (
                    <tr key={`${item?.idPengaduan || item?.id || index}-report`}>
                      <td>{index + 1}</td>
                      <td>{getNamaWarga(item)}</td>
                      <td>{getKategori(item)}</td>
                      <td>{item?.judul || "-"}</td>
                      <td>{formatTanggal(getTanggal(item))}</td>
                      <td><span className={badgeClass(getStatus(item))}>{formatStatus(getStatus(item))}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Kategori Teratas</h2>
          </div>

          <div className="breakdown-list">
            {categoryBreakdown.length === 0 ? (
              <p>Belum ada kategori pada filter ini.</p>
            ) : categoryBreakdown.map((item) => (
              <div className="breakdown-item" key={item.label}>
                <div className="breakdown-top">
                  <strong>{item.label}</strong>
                  <span>{item.value} data • {item.percent}%</span>
                </div>
                <div className="breakdown-track">
                  <div className="breakdown-fill" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ReportsPage;
