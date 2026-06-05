import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { saveUser } from "../services/auth";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@sipandu.local");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginProcess = async (loginEmail, loginPassword) => {
    setError("");
    setLoading(true);

    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      saveUser(result.data);

      if (result.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/warga/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginProcess(email, password);
  };

  const handleDashboardPreview = () => {
    loginProcess("admin@sipandu.local", "password");
  };

  const handleLearnMore = () => {
    setShowInfo((prev) => !prev);
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-hero">
          <div className="brand-mini">
            <div className="brand-icon">S</div>
            <div>
              <h3>SIPANDU</h3>
              <p>Premium Citizen Service</p>
            </div>
          </div>

          <div className="hero-content">
            <span className="eyebrow">LAYANAN WARGA DIGITAL</span>

            <h1>Sistem Pengaduan dan Layanan Warga</h1>

            <p>
              Kelola pengaduan, pantau status layanan, dan permudah komunikasi
              antara masyarakat dan admin secara modern.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="dark-btn"
                onClick={handleDashboardPreview}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Dashboard Preview"}
              </button>

              <button
                type="button"
                className="light-btn"
                onClick={handleLearnMore}
              >
                {showInfo ? "Tutup Info" : "Learn More"}
              </button>
            </div>

            {showInfo && (
              <div className="learn-more-panel">
                <h4>Tentang SIPANDU</h4>
                <p>
                  SIPANDU membantu warga membuat pengaduan, memantau status
                  layanan, dan memudahkan admin dalam mengelola laporan secara
                  terpusat.
                </p>

                <div className="learn-more-list">
                  <span>Pengaduan warga</span>
                  <span>Monitoring status</span>
                  <span>Dashboard admin</span>
                </div>
              </div>
            )}
          </div>

          <div className="floating-card card-one">
            <p>Total Pengaduan</p>
            <h2>1,402</h2>
            <span>Aktif dipantau</span>
          </div>

          <div className="floating-card card-two">
            <p>Status Layanan</p>
            <h2>98%</h2>
            <span>Respons tertangani</span>
          </div>
        </section>

        <section className="login-box">
          <div className="login-header">
            <span className="login-badge">SECURE ACCESS</span>
            <h2>Masuk Akun</h2>
            <p>Gunakan email dan password untuk masuk ke dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <div className="login-footer">
            <p>SIPANDU © Sistem Pengaduan Warga</p>
          </div>
        </section>
      </div>
    </div>
  );
}