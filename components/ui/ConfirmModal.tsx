"use client";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  danger = true,
}: ConfirmModalProps) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 500,
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        className="anim-scale-in modal-inner"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-hover)",
          borderRadius: "18px",
          width: "380px",
          padding: "32px 28px 26px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: danger ? "rgba(224,85,85,0.1)" : "rgba(200,169,110,0.1)",
          border: `1px solid ${danger ? "rgba(224,85,85,0.2)" : "rgba(200,169,110,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px", fontSize: "22px",
        }}>
          {danger ? (
            <svg width="22" height="22" fill="none" stroke="#e05555" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          ) : (
            <svg width="22" height="22" fill="none" stroke="#c8a96e" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        <h3 style={{ fontSize: "18px", color: "var(--text)", marginBottom: "10px" }}>{title}</h3>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "28px" }}>{message}</p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            className="btn-secondary"
            style={{
              flex: 1, padding: "10px",
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text-muted)", borderRadius: "10px",
              fontFamily: "inherit", fontSize: "13px", fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "10px",
              background: danger ? "rgba(224,85,85,0.15)" : "rgba(200,169,110,0.15)",
              border: `1px solid ${danger ? "rgba(224,85,85,0.35)" : "rgba(200,169,110,0.35)"}`,
              color: danger ? "#f07070" : "#c8a96e",
              borderRadius: "10px", fontFamily: "inherit",
              fontSize: "13px", fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = danger ? "rgba(224,85,85,0.25)" : "rgba(200,169,110,0.25)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = danger ? "rgba(224,85,85,0.15)" : "rgba(200,169,110,0.15)";
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
