import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const searchableMenus = [
  {
    title: "Dashboard Warga",
    meta: "Ringkasan pengaduan dan layanan",
    to: "/warga/dashboard",
    keywords: "dashboard ringkasan statistik pengaduan warga",
  },
  {
    title: "Buat Pengaduan",
    meta: "Kirim laporan baru ke admin",
    to: "/warga/buat-pengaduan",
    keywords: "buat pengaduan kirim laporan keluhan form",
  },
  {
    title: "Pengaduan Saya",
    meta: "Riwayat dan status laporan",
    to: "/warga/riwayat",
    keywords: "riwayat status pengaduan saya laporan diproses selesai",
  },
  {
    title: "Layanan KTP",
    meta: "Permohonan KTP dan bukti PDF",
    to: "/warga/layanan-ktp",
    keywords: "ktp nik kk administrasi layanan pembuatan perubahan hilang rusak",
  },
  {
    title: "Profil Saya",
    meta: "Edit akun, no HP, dan alamat",
    to: "/warga/profil",
    keywords: "profil akun edit data email alamat password",
  },
];

function WargaSearchBox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const target = event.target;
        const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);
        if (!isTyping) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }

      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return searchableMenus;

    return searchableMenus.filter((item) => {
      return `${item.title} ${item.meta} ${item.keywords}`.toLowerCase().includes(keyword);
    });
  }, [query]);

  return (
    <div className="warga-search-box">
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Cari layanan warga..."
      />
      <kbd>/</kbd>

      {open && (
        <div className="warga-search-results">
          {results.length === 0 ? (
            <p>Tidak ada menu yang cocok.</p>
          ) : (
            results.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default WargaSearchBox;
