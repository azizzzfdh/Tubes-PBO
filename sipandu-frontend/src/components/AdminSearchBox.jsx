import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import {
  formatStatus,
  formatTanggal,
  getKategori,
  getNamaWarga,
  getStatus,
  getTanggal,
  normalizeText,
} from "../utils/sipanduFormat";

function AdminSearchBox() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [datasets, setDatasets] = useState({
    pengaduan: [],
    masyarakat: [],
    kategori: [],
    pelayanan: [],
  });
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSearchData = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const [pengaduanRes, masyarakatRes, kategoriRes, pelayananRes] = await Promise.allSettled([
        apiFetch("/pengaduan"),
        apiFetch("/masyarakat"),
        apiFetch("/kategori"),
        apiFetch("/pelayanan"),
      ]);

      const unwrap = (result) => {
        if (result.status !== "fulfilled") return [];
        return Array.isArray(result.value) ? result.value : result.value?.data || [];
      };

      setDatasets({
        pengaduan: unwrap(pengaduanRes),
        masyarakat: unwrap(masyarakatRes),
        kategori: unwrap(kategoriRes),
        pelayanan: unwrap(pelayananRes),
      });
    } catch (error) {
      console.error("Gagal memuat data pencarian:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (focused || query.trim().length >= 2) {
      loadSearchData();
    }
  }, [focused]);

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const results = useMemo(() => {
    const keyword = normalizeText(query);

    if (keyword.length < 2) return [];

    const rows = [];

    datasets.pengaduan.forEach((item) => {
      const haystack = [
        item?.judul,
        item?.isiPengaduan,
        item?.isi,
        getNamaWarga(item),
        getKategori(item),
        formatStatus(getStatus(item)),
      ]
        .map(normalizeText)
        .join(" ");

      if (haystack.includes(keyword)) {
        rows.push({
          type: "Pengaduan",
          title: item?.judul || "Pengaduan warga",
          subtitle: `${getNamaWarga(item)} • ${getKategori(item)} • ${formatStatus(getStatus(item))}`,
          meta: formatTanggal(getTanggal(item), { short: true }),
          to: "/admin/pengaduan",
        });
      }
    });

    datasets.masyarakat.forEach((item) => {
      const haystack = [item?.nama, item?.email, item?.noHp, item?.no_hp, item?.alamat]
        .map(normalizeText)
        .join(" ");

      if (haystack.includes(keyword)) {
        rows.push({
          type: "Masyarakat",
          title: item?.nama || "Data masyarakat",
          subtitle: `${item?.email || "-"} • ${item?.noHp || item?.no_hp || "No HP kosong"}`,
          meta: "Data warga",
          to: "/admin/masyarakat",
        });
      }
    });

    datasets.kategori.forEach((item) => {
      const namaKategori = item?.namaKategori || item?.nama_kategori || "Kategori";
      const haystack = [namaKategori, item?.deskripsi].map(normalizeText).join(" ");

      if (haystack.includes(keyword)) {
        rows.push({
          type: "Kategori",
          title: namaKategori,
          subtitle: item?.deskripsi || "Kategori layanan SIPANDU",
          meta: "Master layanan",
          to: "/admin/kategori",
        });
      }
    });

    datasets.pelayanan.forEach((item) => {
      const haystack = [
        item?.keterangan,
        item?.judulPengaduan,
        item?.pengaduan?.judul,
        item?.namaMasyarakat,
        item?.namaWarga,
        formatStatus(getStatus(item)),
      ]
        .map(normalizeText)
        .join(" ");

      if (haystack.includes(keyword)) {
        rows.push({
          type: "Pelayanan",
          title: item?.judulPengaduan || item?.pengaduan?.judul || "Tindak lanjut pelayanan",
          subtitle: `${item?.namaMasyarakat || item?.namaWarga || "Warga"} • ${formatStatus(getStatus(item))}`,
          meta: formatTanggal(getTanggal(item), { short: true }),
          to: "/admin/pelayanan",
        });
      }
    });

    return rows.slice(0, 8);
  }, [query, datasets]);

  const handleOpenResult = (to) => {
    navigate(to);
    setFocused(false);
    setQuery("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (results[0]) {
      handleOpenResult(results[0].to);
    }
  };

  return (
    <form className="admin-search-box" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Cari pengaduan, warga, kategori..."
      />
      <kbd className="search-kbd">/</kbd>

      {focused && (
        <div className="admin-search-panel">
          {query.trim().length < 2 ? (
            <div className="search-empty-state">
              Ketik minimal 2 huruf untuk mencari pengaduan, warga, kategori, atau pelayanan.
            </div>
          ) : loading ? (
            <div className="search-empty-state">Memuat data pencarian...</div>
          ) : results.length === 0 ? (
            <div className="search-empty-state">Tidak ada hasil untuk “{query}”.</div>
          ) : (
            results.map((item, index) => (
              <button
                key={`${item.type}-${item.title}-${index}`}
                type="button"
                className="search-result-item"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleOpenResult(item.to)}
              >
                <span>{item.type}</span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
                <em>{item.meta}</em>
              </button>
            ))
          )}
        </div>
      )}
    </form>
  );
}

export default AdminSearchBox;
