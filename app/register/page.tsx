"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

interface PasswordStrength {
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function checkPassword(password: string): PasswordStrength {
  return {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

function StrengthRule({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11.5px", color: passed ? "#4caf82" : "var(--text-dim)", transition: "color 0.2s" }}>
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        {passed
          ? <polyline points="20 6 9 17 4 12"/>
          : <circle cx="12" cy="12" r="9"/>}
      </svg>
      {label}
    </div>
  );
}

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

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: "8px",
  padding: "10px 12px", color: "var(--text)", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", color: "var(--text-dim)",
  textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600,
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = checkPassword(form.password);
  const allPassed = Object.values(strength).every(Boolean);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";
  const canSubmit = allPassed && passwordsMatch;

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required."); return;
    }
    if (!allPassed) { setError("Password does not meet the requirements."); return; }
    if (!passwordsMatch) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const data = await api.post("/auth/register", {
        name: form.name, email: form.email, password: form.password,
      }, false);

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
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
        borderRadius: "20px", padding: "40px 36px", width: "420px", maxWidth: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "14px", background: "rgba(200,169,110,0.12)", border: "1px solid rgba(200,169,110,0.2)", marginBottom: "16px" }}>
            <svg width="22" height="22" fill="none" stroke="#c8a96e" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div style={{ fontFamily: "serif", fontSize: "26px", color: "#c8a96e", letterSpacing: "0.5px" }}>LibraryOS</div>
          <div style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "4px" }}>Create your account</div>
        </div>

        {error && (
          <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "18px", color: "#f07070", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text" placeholder="e.g. Chiamaka Prosper" value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email" placeholder="e.g. admin@school.edu" value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password" value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <button
              onClick={() => setShowPassword(s => !s)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {form.password.length > 0 && (
            <div style={{ marginTop: "10px", background: "var(--surface2)", borderRadius: "8px", padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
              <StrengthRule passed={strength.hasLength} label="8+ characters" />
              <StrengthRule passed={strength.hasUpper} label="Uppercase letter" />
              <StrengthRule passed={strength.hasLower} label="Lowercase letter" />
              <StrengthRule passed={strength.hasNumber} label="Number" />
              <StrengthRule passed={strength.hasSpecial} label="Special character" />
            </div>
          )}
        </div>

        <div style={{ marginBottom: "26px" }}>
          <label style={labelStyle}>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"} placeholder="Repeat your password" value={form.confirmPassword}
              onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              style={{
                ...inputStyle,
                paddingRight: "46px",
                borderColor: form.confirmPassword
                  ? passwordsMatch ? "rgba(76,175,130,0.45)" : "rgba(224,85,85,0.45)"
                  : "var(--border)",
              }}
            />
            <button
              onClick={() => setShowConfirmPassword(s => !s)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "2px", display: "flex", alignItems: "center" }}
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
          {form.confirmPassword.length > 0 && (
            <div style={{ marginTop: "6px", fontSize: "12px", color: passwordsMatch ? "#4caf82" : "#e05555", display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                {passwordsMatch ? <polyline points="20 6 9 17 4 12"/> : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
              </svg>
              {passwordsMatch ? "Passwords match" : "Passwords do not match"}
            </div>
          )}
        </div>

        <button
          onClick={handleRegister} disabled={loading}
          className="btn-primary"
          style={{
            width: "100%", padding: "12px",
            background: canSubmit ? "#c8a96e" : "var(--surface3)",
            color: canSubmit ? "var(--bg)" : "var(--text-dim)",
            border: "none", borderRadius: "10px", fontSize: "15px",
            fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "all 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-dim)", marginTop: "22px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#c8a96e", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}
