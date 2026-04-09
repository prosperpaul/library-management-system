"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1c202c",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
  padding: "10px 12px", color: "#f0ece4", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", color: "#5a5f78",
  textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600,
};

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
      background: "#0f1117",
      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
      backgroundSize: "28px 28px",
    }}>
      <div className="anim-fade-up" style={{
        background: "#14171f", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px", padding: "40px 36px", width: "380px", maxWidth: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "14px", background: "rgba(200,169,110,0.12)", border: "1px solid rgba(200,169,110,0.2)", marginBottom: "16px" }}>
            <svg width="22" height="22" fill="none" stroke="#c8a96e" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div style={{ fontFamily: "serif", fontSize: "26px", color: "#c8a96e", letterSpacing: "0.5px" }}>LibraryOS</div>
          <div style={{ fontSize: "13px", color: "#5a5f78", marginTop: "4px" }}>School Library Management System</div>
        </div>

        {error && (
          <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", color: "#f07070", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" value={email} placeholder="admin@school.edu"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: "11px", color: "#c8a96e", textDecoration: "none", fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <button
              onClick={() => setShowPassword(s => !s)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a5f78", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin} disabled={loading}
          className="btn-primary"
          style={{
            width: "100%", padding: "12px", background: "#c8a96e",
            color: "#0f1117", border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: loading ? 0.7 : 1, transition: "all 0.2s",
          }}
        >
          {loading ? "Signing in..." : "Sign in →"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5f78", marginTop: "22px" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#c8a96e", textDecoration: "none", fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </main>
  );
}
