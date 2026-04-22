"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export default function Topbar({ title, subtitle, onAdd, addLabel = "+ Add New" }: TopbarProps) {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <div style={{
        padding: isMobile ? "0 20px" : "0 28px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
        gap: "12px",
      }}>
        {/* Left: title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          <h1 style={{
            fontFamily: "serif",
            fontSize: isMobile ? "20px" : "22px",
            color: "var(--text)",
            whiteSpace: "nowrap",
          }}>
            {title}
          </h1>
          {subtitle && !isMobile && (
            <span style={{
              fontSize: "12px", color: "var(--text-dim)",
              background: "var(--hover-bg)",
              border: "1px solid var(--border)",
              padding: "2px 10px", borderRadius: "20px",
            }}>
              {subtitle}
            </span>
          )}
        </div>

        {/* Right: role badge + (desktop) add button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {user && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: isMobile ? "4px 10px" : "4px 12px",
              borderRadius: "20px", fontSize: isMobile ? "10px" : "11px",
              fontWeight: 600, letterSpacing: "0.5px",
              background: user.role === "admin" ? "rgba(200,169,110,0.1)" : "rgba(90,141,238,0.1)",
              border: `1px solid ${user.role === "admin" ? "rgba(200,169,110,0.2)" : "rgba(90,141,238,0.2)"}`,
              color: user.role === "admin" ? "#c8a96e" : "#5a8dee",
              textTransform: "uppercase",
            }}>
              {user.role === "admin" ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/>
                </svg>
              )}
              {user.role === "admin" ? "Admin" : "Attendant"}
            </div>
          )}

          {/* Desktop: inline add button */}
          {!isMobile && onAdd && (
            <button
              onClick={onAdd}
              className="btn-primary"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 18px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: 600,
                background: "#c8a96e",
                color: "var(--bg)",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Mobile: floating action button */}
      {isMobile && onAdd && (
        <button
          onClick={onAdd}
          aria-label={addLabel}
          style={{
            position: "fixed",
            right: "20px",
            bottom: "92px",
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "#c8a96e",
            color: "var(--bg)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(200, 169, 110, 0.35), 0 2px 8px rgba(0, 0, 0, 0.4)",
            zIndex: 44,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      )}
    </>
  );
}
