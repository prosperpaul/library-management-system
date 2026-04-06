// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!email) return;
//     setLoading(true);
//     // When you add a reset endpoint to your backend, call it here:
//     // await api.post("/auth/forgot-password", { email }, false);
//     await new Promise(r => setTimeout(r, 1000)); // simulate delay
//     setSubmitted(true);
//     setLoading(false);
//   };

//   return (
//     <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f1117", padding: "20px" }}>
//       <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px", width: "380px", maxWidth: "100%" }}>

//         <div style={{ textAlign: "center", marginBottom: "32px" }}>
//           <h1 style={{ fontFamily: "serif", fontSize: "28px", color: "#c8a96e", marginBottom: "4px" }}>LibraryOS</h1>
//           <p style={{ fontSize: "13px", color: "#5a5f78" }}>Reset your password</p>
//         </div>

//         {!submitted ? (
//           <>
//             <p style={{ fontSize: "14px", color: "#8a8fa8", marginBottom: "24px", lineHeight: 1.6 }}>
//               Enter the email address linked to your account and we'll send you a reset link.
//             </p>

//             <div style={{ marginBottom: "20px" }}>
//               <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 placeholder="admin@school.edu"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={{ width: "100%", background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
//               />
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading || !email}
//               style={{ width: "100%", padding: "12px", background: email ? "#c8a96e" : "#2a2d3a", color: email ? "#0f1117" : "#5a5f78", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: email ? "pointer" : "not-allowed", fontFamily: "inherit" }}
//             >
//               {loading ? "Sending..." : "Send Reset Link →"}
//             </button>
//           </>
//         ) : (
//           <div style={{ textAlign: "center" }}>
//             <div style={{ fontSize: "48px", marginBottom: "16px" }}>📬</div>
//             <h2 style={{ fontSize: "18px", color: "#f0ece4", marginBottom: "8px" }}>Check your email</h2>
//             <p style={{ fontSize: "14px", color: "#8a8fa8", lineHeight: 1.6 }}>
//               If an account exists for <strong style={{ color: "#c8a96e" }}>{email}</strong>, a password reset link has been sent.
//             </p>
//           </div>
//         )}

//         <p style={{ textAlign: "center", fontSize: "13px", color: "#5a5f78", marginTop: "24px" }}>
//           Remember your password?{" "}
//           <Link href="/login" style={{ color: "#c8a96e", textDecoration: "none" }}>Back to login</Link>
//         </p>
//       </div>
//     </main>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f1117" }}>
      <div style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "40px", width: "360px" }}>
        <h1 style={{ fontFamily: "serif", fontSize: "28px", color: "#c8a96e", textAlign: "center", marginBottom: "4px" }}>LibraryOS</h1>
        <p style={{ fontSize: "13px", color: "#5a5f78", textAlign: "center", marginBottom: "32px" }}>Reset your password</p>

        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📬</div>
            <p style={{ color: "#f0ece4", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Check your email</p>
            <p style={{ color: "#5a5f78", fontSize: "13px" }}>
              If an account exists for <span style={{ color: "#c8a96e" }}>{email}</span>, a password reset link has been sent.
            </p>
          </div>
        ) : (
          <>
            {error && <p style={{ color: "#e05555", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{error}</p>}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prosper@gmail.com"
                style={{ width: "100%", background: "#232839", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#c8a96e", color: "#0f1117", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link href="/login" style={{ fontSize: "13px", color: "#5a5f78", textDecoration: "none" }}>
            Remember your password? Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}