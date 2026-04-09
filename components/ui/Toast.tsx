"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [message, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className="anim-slide-right"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        background: isSuccess ? "#14271e" : "#271414",
        border: `1px solid ${isSuccess ? "rgba(76,175,130,0.4)" : "rgba(224,85,85,0.4)"}`,
        borderRadius: "12px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: isSuccess ? "#4cdf99" : "#f07070",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        maxWidth: "360px",
        minWidth: "240px",
      }}
    >
      {/* Icon */}
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
        background: isSuccess ? "rgba(76,175,130,0.15)" : "rgba(224,85,85,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px",
      }}>
        {isSuccess ? "✓" : "✕"}
      </div>

      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>

      <button
        onClick={onClose}
        style={{
          background: "none", border: "none", padding: "2px",
          color: isSuccess ? "rgba(76,175,130,0.6)" : "rgba(224,85,85,0.6)",
          cursor: "pointer", fontSize: "16px", flexShrink: 0, lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
