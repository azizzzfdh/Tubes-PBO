export function escapeHtml(value) {
  return String(value ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatDateId(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return value;
  }
}

export function formatStatusLabel(status) {
  const labels = {
    MENUNGGU: "Menunggu",
    DIPROSES: "Diproses",
    SELESAI: "Selesai",
    DITOLAK: "Ditolak",
  };

  return labels[status] || status || "-";
}

function buildSummary(summary = []) {
  if (!summary.length) return "";

  return `
    <div class="summary-grid">
      ${summary
        .map(
          (item) => `
            <div class="summary-card">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function buildDetailRows(details = []) {
  if (!details.length) return "";

  return `
    <div class="detail-card">
      ${details
        .map(
          (item) => `
            <div class="detail-row">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function buildTable(columns = [], rows = []) {
  if (!columns.length) return "";

  return `
    <table>
      <thead>
        <tr>
          ${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.length
          ? rows
              .map(
                (row) => `
                  <tr>
                    ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                  </tr>
                `
              )
              .join("")
          : `<tr><td colspan="${columns.length}" class="empty">Tidak ada data</td></tr>`}
      </tbody>
    </table>
  `;
}

export function exportHtmlToPdf({
  title,
  subtitle,
  summary = [],
  details = [],
  columns = [],
  rows = [],
  footer = "Dokumen ini dicetak otomatis melalui SIPANDU.",
}) {
  const printWindow = window.open("", "_blank", "width=1100,height=800");

  if (!printWindow) {
    alert("Popup diblokir browser. Izinkan popup untuk menggunakan export PDF.");
    return;
  }

  const printedAt = new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 38px;
            font-family: Inter, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
          }
          .document-header {
            border-bottom: 4px solid #0f172a;
            padding-bottom: 18px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            gap: 28px;
          }
          .brand {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #475569;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          h1 {
            margin: 0;
            font-size: 28px;
            line-height: 1.2;
          }
          .subtitle {
            margin: 8px 0 0;
            max-width: 720px;
            color: #475569;
            line-height: 1.6;
            font-size: 13px;
          }
          .printed-at {
            min-width: 170px;
            text-align: right;
            color: #64748b;
            font-size: 12px;
            line-height: 1.6;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 22px;
          }
          .summary-card {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px;
            background: #f8fafc;
          }
          .summary-card span,
          .detail-row span {
            display: block;
            color: #64748b;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .7px;
            margin-bottom: 5px;
          }
          .summary-card strong {
            display: block;
            font-size: 24px;
          }
          .detail-card {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 22px;
          }
          .detail-row {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 16px;
            padding: 13px 16px;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-row:last-child { border-bottom: none; }
          .detail-row strong {
            font-size: 13px;
            line-height: 1.55;
            white-space: pre-wrap;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            font-size: 12px;
          }
          th {
            background: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 11px;
          }
          td {
            border: 1px solid #e2e8f0;
            padding: 10px 11px;
            vertical-align: top;
            line-height: 1.45;
          }
          tr:nth-child(even) td { background: #f8fafc; }
          .empty { text-align: center; color: #64748b; }
          .footer {
            margin-top: 24px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 11px;
            line-height: 1.6;
          }
          @media print {
            body { padding: 24px; }
            button { display: none; }
            .summary-grid { grid-template-columns: repeat(4, 1fr); }
          }
        </style>
      </head>
      <body>
        <header class="document-header">
          <div>
            <div class="brand">SIPANDU</div>
            <h1>${escapeHtml(title)}</h1>
            ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ""}
          </div>
          <div class="printed-at">
            Dicetak pada<br />
            <strong>${escapeHtml(printedAt)}</strong>
          </div>
        </header>

        ${buildSummary(summary)}
        ${buildDetailRows(details)}
        ${buildTable(columns, rows)}

        <footer class="footer">${escapeHtml(footer)}</footer>

        <script>
          window.onload = function () {
            window.focus();
            setTimeout(function () { window.print(); }, 350);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
