"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stage, setStage] = useState<"confirm" | "leaving">("confirm");

  const userName = user?.name?.split(" ")[0] || "Librarian";

  const handleLogout = () => {
    setStage("leaving");
    setTimeout(() => {
      logout();
    }, 1600);
  };

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  return (
    <main style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "20px",
      background: "var(--bg)",
      backgroundImage: "radial-gradient(circle at 1px 1px, var(--hover-bg) 1px, transparent 0)",
      backgroundSize: "28px 28px",
    }}>

      <style>{`
        @keyframes logoutPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes logoutFadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.92); }
        }
        @keyframes checkDraw {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        .logout-card-enter {
          animation: fadeUp 0.4s ease forwards;
        }
        .logout-card-leave {
          animation: logoutFadeOut 0.5s ease forwards;
          animation-delay: 1s;
        }
        .logout-icon-pulse {
          animation: logoutPulse 2s ease-in-out infinite;
        }
        .logout-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkDraw 0.6s ease forwards;
          animation-delay: 0.2s;
        }
      `}</style>

      <div
        className={stage === "confirm" ? "logout-card-enter" : "logout-card-leave"}
        style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "24px", padding: "48px 44px", width: "400px", maxWidth: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)", textAlign: "center",
        }}
      >

        {stage === "confirm" ? (
          <>
            {/* Icon */}
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.18)",
              marginBottom: "24px",
            }}>
              <svg width="32" height="32" fill="none" stroke="#e05555" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>

            {/* Text */}
            <div style={{ fontFamily: "serif", fontSize: "24px", color: "var(--text)", marginBottom: "10px" }}>
              Leaving already?
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.7, marginBottom: "32px" }}>
              You're about to sign out of your LibraryOS account, <span style={{ color: "#c8a96e", fontWeight: 500 }}>{userName}</span>. You'll need to sign in again next time.
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => router.back()}
                style={{
                  flex: 1, padding: "13px",
                  background: "transparent", color: "var(--text-muted)",
                  border: "1px solid var(--border-hover)", borderRadius: "12px",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--hover-bg)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
                }}
              >
                Stay signed in
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, padding: "13px",
                  background: "rgba(224,85,85,0.12)", color: "#e05555",
                  border: "1px solid rgba(224,85,85,0.25)", borderRadius: "12px",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#e05555";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(224,85,85,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#e05555";
                }}
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Animated goodbye */}
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "72px", height: "72px", borderRadius: "50%",
              background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.25)",
              marginBottom: "24px",
            }}>
              <svg width="32" height="32" fill="none" stroke="#4caf82" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline className="logout-check" points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <div className="logout-icon-pulse" style={{ fontFamily: "serif", fontSize: "24px", color: "var(--text)", marginBottom: "10px" }}>
              Goodbye, {userName}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.7 }}>
              Signing you out securely...
            </div>
          </>
        )}

      </div>
    </main>
  );
}
