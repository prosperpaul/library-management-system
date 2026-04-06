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
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: passed ? "#4caf82" : "#5a5f78" }}>
      <span style={{ fontSize: "14px" }}>{passed ? "✓" : "○"}</span>
      {label}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = checkPassword(form.password);
  const allPassed = Object.values(strength).every(Boolean);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";

  const handleRegister = async () => {
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required."); return;
    }
    if (!allPassed) {
      setError("Password does not meet the requirements."); return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match."); return;
    }

    setLoading(true);
    try {
      const data = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      }, false);

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else if (data.message === "User already exists") {
        setError("An account with this email already exists.");
      } else {
        setError(data.message || "Registration failed. Try again.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#1c202c",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
    padding: "10px 12px", color: "#f0ece4", fontSize: "14px",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block", fontSize: "11px", color: "#5a5f78",
    textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "6px",
  };

  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f1117", padding: "20px" }}>
      <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px", width: "400px", maxWidth: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "serif", fontSize: "28px", color: "#c8a96e", marginBottom: "4px" }}>LibraryOS</h1>
          <p style={{ fontSize: "13px", color: "#5a5f78" }}>Create your account</p>
        </div>

        {error && (
          <div style={{ background: "rgba(224,85,85,0.12)", border: "1px solid rgba(224,85,85,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#e05555", fontSize: "13px" }}>
            {error}
          </div>
        )}

        {/* Full Name */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="e.g. Chiamaka Prosper"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="e.g. admin@school.edu"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <button
              onClick={() => setShowPassword(s => !s)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "16px" }}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Password strength rules */}
          {form.password.length > 0 && (
            <div style={{ marginTop: "12px", background: "#1c202c", borderRadius: "8px", padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <StrengthRule passed={strength.hasLength} label="8+ characters" />
              <StrengthRule passed={strength.hasUpper} label="Uppercase letter" />
              <StrengthRule passed={strength.hasLower} label="Lowercase letter" />
              <StrengthRule passed={strength.hasNumber} label="Number" />
              <StrengthRule passed={strength.hasSpecial} label="Special character" />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            style={{
              ...inputStyle,
              borderColor: form.confirmPassword
                ? passwordsMatch ? "rgba(76,175,130,0.5)" : "rgba(224,85,85,0.5)"
                : "rgba(255,255,255,0.07)",
            }}
          />
          {form.confirmPassword.length > 0 && (
            <div style={{ marginTop: "6px", fontSize: "12px", color: passwordsMatch ? "#4caf82" : "#e05555" }}>
              {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%", padding: "12px",
            background: allPassed && passwordsMatch ? "#c8a96e" : "#2a2d3a",
            color: allPassed && passwordsMatch ? "#0f1117" : "#5a5f78",
            border: "none", borderRadius: "10px", fontSize: "15px",
            fontWeight: 600, cursor: allPassed && passwordsMatch ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "all 0.2s",
          }}
        >
          {loading ? "Creating account..." : "Create Account →"}
        </button>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5f78", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#c8a96e", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}