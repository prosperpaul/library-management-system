"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  children: ReactNode;
}

export default function Modal({
  open, title, onClose, onSave, saving = false, saveLabel = "Save →", children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, backdropFilter: "blur(4px)", padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-hover)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
          maxHeight: "90vh",
          overflowY: "auto",
          animation: "modalIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "var(--surface)", zIndex: 1,
        }}>
          <h2 style={{ fontFamily: "serif", fontSize: "18px", color: "var(--text)", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>{children}</div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px 20px",
          borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "flex-end", gap: "10px",
          position: "sticky", bottom: 0, background: "var(--surface)",
        }}>
          <button onClick={onClose} style={{
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--text-muted)", padding: "8px 16px", borderRadius: "9px",
            cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
          }}>Cancel</button>
          <button onClick={onSave} disabled={saving} style={{
            background: saving ? "var(--surface3)" : "#c8a96e",
            color: saving ? "var(--text-dim)" : "var(--bg)",
            padding: "8px 20px", borderRadius: "9px",
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
          }}>
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}