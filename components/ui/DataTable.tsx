"use client";

import { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function DataTable({ columns, data, loading = false, emptyMessage = "No data found" }: DataTableProps) {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{
                textAlign: "left", padding: "10px 12px",
                fontSize: "11px", color: "var(--text-dim)",
                textTransform: "uppercase", letterSpacing: "1px",
                borderBottom: "1px solid var(--border)",
                width: col.width,
                whiteSpace: "nowrap",
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "40px", textAlign: "center", color: "var(--text-dim)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <div style={{
                    width: "16px", height: "16px", border: "2px solid var(--border-hover)",
                    borderTopColor: "#c8a96e", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Loading...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "60px", textAlign: "center", color: "var(--text-dim)", fontSize: "14px" }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i} style={{ transition: "background 0.1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg-soft)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{
                    padding: "12px", color: "var(--text-muted)",
                    borderBottom: "1px solid var(--hover-bg)",
                    verticalAlign: "middle",
                  }}>
                    {col.render ? col.render(row) : row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}