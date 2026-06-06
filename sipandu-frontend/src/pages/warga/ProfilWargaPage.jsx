import { useEffect, useState } from "react";
import WargaLayout from "../../components/WargaLayout";
import { getMasyarakatById, updateMasyarakatProfile } from "../../services/api";
import { getUser, updateSavedUser } from "../../services/auth";

function ProfilWargaPage() {
  const savedUser = getUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama: savedUser?.nama || "Warga",
    email: savedUser?.email || "",
    noHp: savedUser?.noHp || savedUser?.no_hp || savedUser?.noHP || "",
    alamat: savedUser?.alamat || "",
    password: "",
  });

  const initial = form.nama ? form.nama.charAt(0).toUpperCase() : "W";

  const loadProfile = async () => {
    if (!savedUser?.id) return;

    try {
      setLoading(true);
      const result = await getMasyarakatById(savedUser.id);
      const data = result?.data || result;
      const patch = {
        nama: data?.nama || savedUser?.nama || "Warga",
        email: data?.email || savedUser?.email || "",
        noHp: data?.noHp || data?.no_hp || "",
        alamat: data?.alamat || "",
      };

      setForm((current) => ({ ...current, ...patch, password: "" }));
      updateSavedUser(patch);
    } catch (err) {
      console.error("Gagal memuat profil warga:", err);
      setError(err.message || "Gagal memuat profil warga");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.nama.trim() || !form.email.trim()) {
      setError("Nama dan email wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        nama: form.nama.trim(),
        email: form.email.trim(),
        noHp: form.noHp.trim(),
        alamat: form.alamat.trim(),
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const result = await updateMasyarakatProfile(savedUser?.id || 1, payload);
      const data = result?.data || payload;
      updateSavedUser({
        id: savedUser?.id || data?.idMasyarakat || data?.id,
        nama: data?.nama || payload.nama,
        email: data?.email || payload.email,
        noHp: data?.noHp || payload.noHp,
        alamat: data?.alamat || payload.alamat,
        role: "MASYARAKAT",
      });

      setForm((current) => ({ ...current, password: "" }));
      setMessage(result?.message || "Profil berhasil diperbarui.");
    } catch (err) {
      console.error("Gagal menyimpan profil warga:", err);
      setError(err.message || "Gagal menyimpan profil warga");
    } finally {
      setSaving(false);
    }
  };

  return (
    <WargaLayout
      title="Profil Saya"
      description="Lihat dan edit informasi akun masyarakat pada sistem SIPANDU."
      active="profil"
    >
        <section className="card">
          <div className="card-header">
            <div>
              <h2>Informasi Profil</h2>
              <p className="card-subtitle">Data ini tampil pada menu akun dan dokumen layanan.</p>
            </div>
            <button className="btn-outline btn-outline-green" onClick={loadProfile} disabled={loading}>Refresh Profil</button>
          </div>

          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          <div className="profile-detail">
            <div className="profile-avatar-large profile-avatar-user">{initial}</div>

            <div className="profile-info-list">
              <div><span>Nama</span><strong>{form.nama || "-"}</strong></div>
              <div><span>Email</span><strong>{form.email || "-"}</strong></div>
              <div><span>No HP</span><strong>{form.noHp || "-"}</strong></div>
              <div><span>Alamat</span><strong>{form.alamat || "-"}</strong></div>
              <div><span>Role</span><strong>Masyarakat</strong></div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Edit Profil Saya</h2>
          </div>

          <form className="form-modern" onSubmit={handleSubmit}>
            <div className="ktp-form-grid">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama lengkap" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
              </div>

              <div className="form-group">
                <label>No HP</label>
                <input name="noHp" value={form.noHp} onChange={handleChange} placeholder="Nomor HP" />
              </div>

              <div className="form-group">
                <label>Password Baru</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Kosongkan jika tidak diganti" />
              </div>

              <div className="form-group form-span-2">
                <label>Alamat</label>
                <textarea name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat lengkap" />
              </div>
            </div>

            <div className="form-action">
              <button type="button" className="btn-secondary" onClick={loadProfile} disabled={loading || saving}>Batal / Muat Ulang</button>
              <button type="submit" className="btn-primary btn-user" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>
            </div>
          </form>
        </section>
    </WargaLayout>
  );
}

export default ProfilWargaPage;
