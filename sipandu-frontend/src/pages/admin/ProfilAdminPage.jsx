import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getAdminById, updateAdminProfile } from "../../services/api";
import { getUser, updateSavedUser } from "../../services/auth";

function ProfilAdminPage() {
  const savedUser = getUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nama: savedUser?.nama || "Admin Kecamatan",
    email: savedUser?.email || "admin@sipandu.local",
    jabatan: savedUser?.jabatan || "Administrator",
    password: "",
  });

  const initial = form.nama ? form.nama.charAt(0).toUpperCase() : "A";

  const loadProfile = async () => {
    if (!savedUser?.id) return;

    try {
      setLoading(true);
      const result = await getAdminById(savedUser.id);
      const data = result?.data || result;
      const patch = {
        nama: data?.nama || savedUser?.nama || "Admin Kecamatan",
        email: data?.email || savedUser?.email || "admin@sipandu.local",
        jabatan: data?.jabatan || savedUser?.jabatan || "Administrator",
      };

      setForm((current) => ({ ...current, ...patch, password: "" }));
      updateSavedUser(patch);
    } catch (err) {
      console.error("Gagal memuat profil admin:", err);
      setError(err.message || "Gagal memuat profil admin");
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
        jabatan: form.jabatan.trim(),
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const result = await updateAdminProfile(savedUser?.id || 1, payload);
      const data = result?.data || payload;
      updateSavedUser({
        id: savedUser?.id || data?.idAdmin || data?.id,
        nama: data?.nama || payload.nama,
        email: data?.email || payload.email,
        jabatan: data?.jabatan || payload.jabatan,
        role: "ADMIN",
      });

      setForm((current) => ({ ...current, password: "" }));
      setMessage(result?.message || "Profil admin berhasil diperbarui.");
    } catch (err) {
      console.error("Gagal menyimpan profil admin:", err);
      setError(err.message || "Gagal menyimpan profil admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Profil Admin"
      description="Lihat dan edit data akun admin sistem SIPANDU."
      active="profil"
    >
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Informasi Profil</h2>
            <p className="card-subtitle">Data ini juga dipakai pada avatar dan menu akun di kanan atas.</p>
          </div>
          <button className="btn-outline" onClick={loadProfile} disabled={loading}>Refresh Profil</button>
        </div>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}

        <div className="profile-detail">
          <div className="profile-avatar-large">{initial}</div>

          <div className="profile-info-list">
            <div>
              <span>Nama</span>
              <strong>{form.nama || "-"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{form.email || "-"}</strong>
            </div>
            <div>
              <span>Jabatan</span>
              <strong>{form.jabatan || "Administrator"}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>ADMIN</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Edit Profil Admin</h2>
        </div>

        <form className="form-modern" onSubmit={handleSubmit}>
          <div className="filter-panel">
            <div className="form-group">
              <label>Nama Admin</label>
              <input name="nama" value={form.nama} onChange={handleChange} placeholder="Nama admin" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email admin" />
            </div>

            <div className="form-group">
              <label>Jabatan</label>
              <input name="jabatan" value={form.jabatan} onChange={handleChange} placeholder="Contoh: Petugas Pelayanan" />
            </div>

            <div className="form-group">
              <label>Password Baru</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Kosongkan jika tidak diganti" />
            </div>
          </div>

          <div className="form-action">
            <button type="button" className="btn-secondary" onClick={loadProfile} disabled={loading || saving}>Batal / Muat Ulang</button>
            <button type="submit" className="btn-primary btn-admin" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}

export default ProfilAdminPage;
