"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1c202c",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
  padding: "10px 12px", color: "#f0ece4", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email }, false);
      setSubmitted(true);
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
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

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "14px", background: "rgba(200,169,110,0.12)", border: "1px solid rgba(200,169,110,0.2)", marginBottom: "16px" }}>
            <svg width="22" height="22" fill="none" stroke="#c8a96e" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div style={{ fontFamily: "serif", fontSize: "26px", color: "#c8a96e", letterSpacing: "0.5px" }}>LibraryOS</div>
          <div style={{ fontSize: "13px", color: "#5a5f78", marginTop: "4px" }}>Reset your password</div>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", background: "rgba(76,175,130,0.12)", border: "1px solid rgba(76,175,130,0.25)", marginBottom: "20px" }}>
              <svg width="28" height="28" fill="none" stroke="#4caf82" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#f0ece4", marginBottom: "10px" }}>Check your email</div>
            <div style={{ fontSize: "13px", color: "#5a5f78", lineHeight: 1.7 }}>
              If an account exists for{" "}
              <span style={{ color: "#c8a96e", fontWeight: 500 }}>{email}</span>,
              {" "}a password reset link has been sent.
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "13px", color: "#8a8fa8", marginBottom: "24px", lineHeight: 1.7 }}>
              Enter the email address linked to your account and we'll send you a reset link.
            </p>

            {error && (
              <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", color: "#f07070", fontSize: "13px" }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>
                Email Address
              </label>
              <input
                type="email" value={email} placeholder="admin@school.edu"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleSubmit} disabled={loading || !email.trim()}
              className="btn-primary"
              style={{
                width: "100%", padding: "12px",
                background: email.trim() ? "#c8a96e" : "#2a2d3a",
                color: email.trim() ? "#0f1117" : "#5a5f78",
                border: "none", borderRadius: "10px", fontSize: "15px",
                fontWeight: 700, cursor: email.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit", transition: "all 0.2s",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5f78", marginTop: "24px" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#c8a96e", textDecoration: "none", fontWeight: 500 }}>Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}
