import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WargaLayout from "../../components/WargaLayout";
import { apiFetch } from "../../services/api";
import { getUser } from "../../services/auth";
import { exportHtmlToPdf, formatDateId } from "../../utils/pdfExport";

const jenisPermohonanOptions = [
  "Pembuatan KTP Baru",
  "Perubahan Data KTP",
  "Penggantian KTP Hilang",
  "Penggantian KTP Rusak",
];

const initialForm = {
  jenisPermohonan: "Pembuatan KTP Baru",
  nik: "",
  nomorKk: "",
  tempatLahir: "",
  tanggalLahir: "",
  alamat: "",
  pekerjaan: "",
  alasan: "",
  catatan: "",
};

function LayananKtpPage() {
  const navigate = useNavigate();
  const user = getUser();

  const [kategoriList, setKategoriList] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastSubmission, setLastSubmission] = useState(null);

  useEffect(() => {
    loadKategori();
  }, []);

  const ktpKategori = useMemo(() => {
    return kategoriList.find((item) => {
      const nama = (item?.namaKategori || item?.nama_kategori || "").toLowerCase();
      return nama.includes("ktp");
    });
  }, [kategoriList]);

  const loadKategori = async () => {
    try {
      setLoadingKategori(true);
      const result = await apiFetch("/kategori");
      const dataKategori = Array.isArray(result) ? result : result?.data || [];
      setKategoriList(dataKategori);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
      setError(err.message || "Gagal memuat kategori layanan");
    } finally {
      setLoadingKategori(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!ktpKategori) {
      return "Kategori Pembuatan KTP belum tersedia. Tambahkan kategori ini dari menu Kategori Layanan atau jalankan data.sql terbaru.";
    }

    if (!user?.id) {
      return "Data user tidak ditemukan. Silakan login ulang.";
    }

    if (!/^\d{16}$/.test(form.nik.trim())) {
      return "NIK wajib 16 digit angka.";
    }

    if (!/^\d{16}$/.test(form.nomorKk.trim())) {
      return "Nomor KK wajib 16 digit angka.";
    }

    if (!form.tempatLahir.trim()) return "Tempat lahir wajib diisi.";
    if (!form.tanggalLahir) return "Tanggal lahir wajib diisi.";
    if (!form.alamat.trim()) return "Alamat wajib diisi.";
    if (!form.alasan.trim()) return "Alasan permohonan wajib diisi.";

    return "";
  };

  const buildIsiPengaduan = () => {
    return [
      `Jenis Permohonan: ${form.jenisPermohonan}`,
      `NIK: ${form.nik.trim()}`,
      `Nomor KK: ${form.nomorKk.trim()}`,
      `Tempat/Tanggal Lahir: ${form.tempatLahir.trim()}, ${formatDateId(form.tanggalLahir)}`,
      `Alamat: ${form.alamat.trim()}`,
      `Pekerjaan: ${form.pekerjaan.trim() || "-"}`,
      `Alasan Permohonan: ${form.alasan.trim()}`,
      `Catatan Tambahan: ${form.catatan.trim() || "-"}`,
    ].join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoadingSubmit(true);

      const payload = {
        idMasyarakat: user.id,
        idKategori: Number(ktpKategori.idKategori || ktpKategori.id),
        judul: `${form.jenisPermohonan} - ${user.nama || "Warga"}`,
        isiPengaduan: buildIsiPengaduan(),
      };

      const result = await apiFetch("/pengaduan", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const savedData = result?.data || {};
      const submission = {
        ...form,
        idPengaduan: savedData.idPengaduan || savedData.id || "-",
        tanggalPengaduan: savedData.tanggalPengaduan || new Date().toISOString(),
        namaPemohon: user.nama || "Warga",
        emailPemohon: user.email || "-",
      };

      setLastSubmission(submission);
      setMessage(result?.message || "Permohonan KTP berhasil dikirim ke admin.");
      setForm(initialForm);
    } catch (err) {
      console.error("Gagal mengirim permohonan KTP:", err);
      setError(err.message || "Gagal mengirim permohonan KTP");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleExportBukti = () => {
    if (!lastSubmission) return;

    exportHtmlToPdf({
      title: "Bukti Permohonan Layanan KTP",
      subtitle: "Dokumen ringkas bukti bahwa permohonan layanan KTP telah dikirim melalui SIPANDU.",
      details: [
        { label: "Nomor Pengaduan", value: lastSubmission.idPengaduan },
        { label: "Nama Pemohon", value: lastSubmission.namaPemohon },
        { label: "Email", value: lastSubmission.emailPemohon },
        { label: "Jenis Permohonan", value: lastSubmission.jenisPermohonan },
        { label: "NIK", value: lastSubmission.nik },
        { label: "Nomor KK", value: lastSubmission.nomorKk },
        { label: "Tempat/Tanggal Lahir", value: `${lastSubmission.tempatLahir}, ${formatDateId(lastSubmission.tanggalLahir)}` },
        { label: "Alamat", value: lastSubmission.alamat },
        { label: "Alasan", value: lastSubmission.alasan },
        { label: "Tanggal Pengajuan", value: formatDateId(lastSubmission.tanggalPengaduan) },
      ],
      footer: "Bukti ini bukan pengganti dokumen kependudukan resmi. Status permohonan tetap mengikuti verifikasi petugas.",
    });
  };

  return (
    <WargaLayout
      title="Layanan Pembuatan KTP"
      description="Ajukan layanan KTP baru, perubahan data, hilang, atau rusak secara terstruktur."
      active="ktp"
    >
        <section className="service-hero-grid">
          <div className="card service-intro-card">
            <span className="service-eyebrow">LAYANAN ADMINISTRASI</span>
            <h2>KTP dibuat lebih mudah dipantau</h2>
            <p>
              Form ini mengubah permohonan KTP menjadi tiket pengaduan yang bisa dipantau oleh warga dan diproses oleh admin.
            </p>

            <div className="service-checklist">
              <span>Validasi NIK dan KK 16 digit</span>
              <span>Ringkasan data otomatis</span>
              <span>Bukti permohonan siap export PDF</span>
            </div>
          </div>

          <div className="card service-status-card">
            <h2>Status Sistem</h2>
            <div className="service-status-row">
              <span>Kategori KTP</span>
              <strong>{loadingKategori ? "Memuat..." : ktpKategori ? "Tersedia" : "Belum tersedia"}</strong>
            </div>
            <div className="service-status-row">
              <span>Alur</span>
              <strong>Menunggu → Diproses → Selesai</strong>
            </div>
            <div className="service-status-row">
              <span>Output</span>
              <strong>Tiket layanan + bukti PDF</strong>
            </div>
          </div>
        </section>

        <section className="card form-page-card ktp-form-card">
          <div className="card-header">
            <div>
              <h2>Form Permohonan KTP</h2>
              <p className="card-subtitle">
                Isi data sesuai dokumen keluarga agar petugas lebih mudah melakukan verifikasi.
              </p>
            </div>
          </div>

          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          {lastSubmission && (
            <div className="success-box ktp-proof-box">
              <div>
                Permohonan terakhir berhasil dibuat. Nomor pengaduan: <strong>{lastSubmission.idPengaduan}</strong>
              </div>
              <button type="button" className="btn-outline btn-outline-green" onClick={handleExportBukti}>
                Export Bukti PDF
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-modern ktp-form-grid">
            <div className="form-group">
              <label>Jenis Permohonan</label>
              <select name="jenisPermohonan" value={form.jenisPermohonan} onChange={handleChange}>
                {jenisPermohonanOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>NIK</label>
              <input
                name="nik"
                value={form.nik}
                onChange={handleChange}
                maxLength="16"
                inputMode="numeric"
                placeholder="16 digit NIK"
              />
            </div>

            <div className="form-group">
              <label>Nomor KK</label>
              <input
                name="nomorKk"
                value={form.nomorKk}
                onChange={handleChange}
                maxLength="16"
                inputMode="numeric"
                placeholder="16 digit nomor KK"
              />
            </div>

            <div className="form-group">
              <label>Tempat Lahir</label>
              <input
                name="tempatLahir"
                value={form.tempatLahir}
                onChange={handleChange}
                placeholder="Contoh: Bandung"
              />
            </div>

            <div className="form-group">
              <label>Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                value={form.tanggalLahir}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pekerjaan</label>
              <input
                name="pekerjaan"
                value={form.pekerjaan}
                onChange={handleChange}
                placeholder="Contoh: Wiraswasta"
              />
            </div>

            <div className="form-group form-span-2">
              <label>Alamat Lengkap</label>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat sesuai domisili/dokumen keluarga"
              />
            </div>

            <div className="form-group form-span-2">
              <label>Alasan Permohonan</label>
              <textarea
                name="alasan"
                value={form.alasan}
                onChange={handleChange}
                placeholder="Contoh: Baru berusia 17 tahun dan membutuhkan KTP pertama"
              />
            </div>

            <div className="form-group form-span-2">
              <label>Catatan Tambahan</label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                placeholder="Opsional: tuliskan catatan untuk petugas"
              />
            </div>

            <div className="form-action form-span-2">
              <button type="button" className="btn-secondary" onClick={() => navigate("/warga/dashboard")}>
                Kembali
              </button>
              <button type="submit" className="btn-primary btn-user" disabled={loadingSubmit || loadingKategori}>
                {loadingSubmit ? "Mengirim..." : "Kirim Permohonan KTP"}
              </button>
            </div>
          </form>
        </section>
    </WargaLayout>
  );
}

export default LayananKtpPage;
