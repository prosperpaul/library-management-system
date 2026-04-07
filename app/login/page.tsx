
// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { api } from "@/lib/api";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await api.post("/auth/login", { email, password },);
//       if (data.token) {
//         localStorage.setItem("token", data.token);
//         router.push("/");
//       } else {
//         setError(data.message || "Invalid credentials");
//       }
//     } catch {
//       setError("Could not connect to server");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f1117" }}>
//       <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px", width: "360px" }}>
//         <h1 style={{ fontFamily: "serif", fontSize: "28px", color: "#c8a96e", textAlign: "center", marginBottom: "4px" }}>LibraryOS</h1>
//         <p style={{ fontSize: "13px", color: "#5a5f78", textAlign: "center", marginBottom: "32px" }}>School Library Management System</p>

//         {error && <p style={{ color: "#e05555", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{error}</p>}

//         <div style={{ marginBottom: "16px" }}>
//           <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="admin@school.edu"
//             style={{ width: "100%", background: "#232839", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none" }}
//           />
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             style={{ width: "100%", background: "#232839", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none" }}
//           />
//         </div>

//      <button
//   onClick={handleLogin}
//   disabled={loading}
//   style={{ width: "100%", padding: "12px", background: "#c8a96e", color: "#0f1117", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
// >
//   {loading ? "Signing in..." : "Sign in →"}
// </button>

// <div style={{ marginTop: "20px", textAlign: "center" }}>
//   <Link href="/register" style={{ fontSize: "13px", color: "#c8a96e", textDecoration: "none" }}>
//     Don't have an account? Register
//   </Link>
// </div>

// <div style={{ marginTop: "10px", textAlign: "center" }}>
//   <Link href="/forgot-password" style={{ fontSize: "13px", color: "#5a5f78", textDecoration: "none" }}>
//     Forgot password?
//   </Link>
// </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#1c202c",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px", padding: "10px 12px",
    color: "#f0ece4", fontSize: "14px",
    outline: "none", fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f1117", padding: "20px" }}>
      <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px", width: "380px", maxWidth: "100%" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "serif", fontSize: "28px", color: "#c8a96e" }}>LibraryOS</div>
          <div style={{ fontSize: "13px", color: "#5a5f78", marginTop: "4px" }}>School Library Management System</div>
        </div>

        {error && (
          <div style={{ background: "rgba(224,85,85,0.12)", border: "1px solid rgba(224,85,85,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#e05555", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Email</label>
          <input
            type="email" value={email} placeholder="admin@school.edu"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <label style={{ fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: "11px", color: "#c8a96e", textDecoration: "none" }}>Forgot password?</Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <button onClick={() => setShowPassword(s => !s)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "16px" }}>
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "12px", background: "#c8a96e",
          color: "#0f1117", border: "none", borderRadius: "10px",
          fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>
          {loading ? "Signing in..." : "Sign in →"}
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5f78", marginTop: "20px" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#c8a96e", textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </main>
  );
}