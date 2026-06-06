import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function DashboardWarga() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getPengaduan().then(setData);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Warga</h1>

      <h2>Riwayat Pengaduan</h2>
      <ul>
        {data.map((p) => (
          <li key={p.idPengaduan}>
            {p.judul} - {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}