import { useEffect, useState } from "react";
import SidebarWarga from "../../components/SidebarWarga";
import { apiFetch } from "../../services/api";
import { getUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function BuatPengaduanPage() {
  const navigate = useNavigate();
  const user = getUser();

  const [judul, setJudul] = useState("");
  const [isiPengaduan, setIsiPengaduan] = useState("");
  const [idKategori, setIdKategori] = useState("");
  const [kategoriList, setKategoriList] = useState([]);

  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadKategori();
  }, []);

  const loadKategori = async () => {
    try {
      setLoadingKategori(true);
      setError("");

      const result = await apiFetch("/kategori");

      // Supaya aman kalau response backend bentuknya:
      // { data: [...] } atau langsung [...]
      const dataKategori = Array.isArray(result) ? result : result.data || [];

      setKategoriList(dataKategori);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
      setError(err.message || "Gagal memuat data kategori");
    } finally {
      setLoadingKategori(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!judul.trim()) {
      setError("Judul pengaduan wajib diisi");
      return;
    }

    if (!isiPengaduan.trim()) {
      setError("Isi pengaduan wajib diisi");
      return;
    }

    if (!idKategori) {
      setError("Kategori layanan wajib dipilih");
      return;
    }

    if (!user || !user.id) {
      setError("Data user tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      setLoadingSubmit(true);

      const payload = {
        idMasyarakat: user.id,
        idKategori: Number(idKategori),
        judul: judul.trim(),
        isiPengaduan: isiPengaduan.trim(),
      };

      const result = await apiFetch("/pengaduan", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMessage(result.message || "Pengaduan berhasil dikirim");

      setJudul("");
      setIsiPengaduan("");
      setIdKategori("");

      setTimeout(() => {
        navigate("/warga/dashboard");
      }, 800);
    } catch (err) {
      console.error("Gagal mengirim pengaduan:", err);
      setError(err.message || "Gagal mengirim pengaduan");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="app-layout">
      <SidebarWarga />

      <main className="dashboard-main">
        <header className="topbar topbar-user">
          <div className="topbar-left">
            <h1>Buat Pengaduan</h1>
            <p>Isi formulir pengaduan sesuai masalah yang ingin dilaporkan</p>
          </div>

          <div className="topbar-right">
            <div className="user-avatar">
              {user?.nama ? user.nama.charAt(0).toUpperCase() : "W"}
            </div>
            <div className="user-info">
              <h4>{user?.nama || "Warga"}</h4>
              <p>Masyarakat</p>
            </div>
          </div>
        </header>

        <section className="card form-page-card">
          <div className="card-header">
            <div>
              <h2>Form Pengaduan Warga</h2>
              <p className="card-subtitle">
                Pastikan data yang dikirim sudah benar agar dapat diproses admin.
              </p>
            </div>
          </div>

          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="form-modern">
            <div className="form-group">
              <label>Judul Pengaduan</label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Jalan rusak di depan rumah"
              />
            </div>

            <div className="form-group">
              <label>Kategori Layanan</label>
              <select
                value={idKategori}
                onChange={(e) => setIdKategori(e.target.value)}
                disabled={loadingKategori}
              >
                <option value="">
                  {loadingKategori ? "Memuat kategori..." : "Pilih kategori layanan"}
                </option>

                {kategoriList.map((item) => (
                  <option key={item.idKategori} value={item.idKategori}>
                    {item.namaKategori}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Isi Pengaduan</label>
              <textarea
                value={isiPengaduan}
                onChange={(e) => setIsiPengaduan(e.target.value)}
                placeholder="Tuliskan detail pengaduan Anda..."
              />
            </div>

            <div className="form-action">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/warga/dashboard")}
              >
                Kembali
              </button>

              <button
                type="submit"
                className="btn-primary btn-user"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}