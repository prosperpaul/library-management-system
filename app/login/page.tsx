"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: "10px",
  padding: "12px 14px", color: "var(--text)", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", color: "var(--text-dim)",
  textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600,
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    const err = await login(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <main style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", padding: "20px",
      background: "var(--bg)",
      backgroundImage: "radial-gradient(circle at 1px 1px, var(--hover-bg) 1px, transparent 0)",
      backgroundSize: "28px 28px",
    }}>
      <div className="anim-fade-up" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "24px", padding: "44px 40px", width: "400px", maxWidth: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(200,169,110,0.2), rgba(200,169,110,0.06))",
            border: "1px solid rgba(200,169,110,0.25)", marginBottom: "18px",
          }}>
            <svg width="24" height="24" fill="none" stroke="#c8a96e" strokeWidth="1.7" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div style={{ fontFamily: "serif", fontSize: "28px", color: "var(--text)", letterSpacing: "0.3px", marginBottom: "6px" }}>
            Welcome back
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-dim)" }}>Sign in to your LibraryOS account</div>
        </div>

        {/* Error */}
        {error && (
          <div className="anim-slide-down" style={{
            background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.2)",
            borderRadius: "10px", padding: "11px 14px", marginBottom: "20px",
            color: "#f07070", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email" value={email} placeholder="admin@school.edu"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: "12px", color: "#c8a96e", textDecoration: "none", fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ ...inputStyle, paddingRight: "46px" }}
            />
            <button
              onClick={() => setShowPassword(s => !s)}
              style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {/* Sign in button */}
        <button
          onClick={handleLogin} disabled={loading}
          className="btn-primary"
          style={{
            width: "100%", padding: "13px", background: "#c8a96e",
            color: "var(--bg)", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: loading ? 0.7 : 1, transition: "all 0.2s",
            marginTop: "24px",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-disabled)" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Create account button */}
        <Link href="/register" style={{ textDecoration: "none" }}>
          <button style={{
            width: "100%", padding: "13px",
            background: "transparent",
            color: "#c8a96e", border: "1px solid rgba(200,169,110,0.3)", borderRadius: "12px",
            fontSize: "15px", fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,169,110,0.07)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,169,110,0.5)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,169,110,0.3)";
            }}
          >
            Create an account
          </button>
        </Link>

      </div>
    </main>
  );
}
