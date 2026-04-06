"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";

export default function AttendantsPage() {
  const [attendants, setAttendants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", staffId: "", shift: "", email: "" });

  const fetchAttendants = async () => {
    setLoading(true);
    const data = await api.get("/attendants");
    setAttendants(data.attendants || data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAttendants(); }, []);

  const handleAdd = async () => {
    await api.post("/attendants", form);
    setShowModal(false);
    setForm({ name: "", staffId: "", shift: "", email: "" });
    fetchAttendants();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title="Attendants" onAdd={() => setShowModal(true)} />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          {loading ? (
            <div style={{ color: "#5a5f78", padding: "40px", textAlign: "center" }}>Loading attendants...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Name", "Staff ID", "Shift", "Email", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendants.map((a: any) => (
                  <tr key={a._id}>
                    <td style={{ padding: "12px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{a.name}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{a.staffId || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "11px", background: "rgba(200,169,110,0.15)", color: "#c8a96e" }}>{a.shift || "Morning"}</span>
                    </td>
                    <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{a.email || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <button onClick={async () => { if (confirm("Delete?")) { await api.delete(`/attendants/${a._id}`); fetchAttendants(); } }}
                        style={{ background: "none", border: "1px solid rgba(224,85,85,0.3)", color: "#e05555", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", width: "440px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "18px", color: "#f0ece4" }}>Add New Attendant</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Mrs. Okafor" },
                { label: "Staff ID", key: "staffId", placeholder: "e.g. ATT-001" },
                { label: "Shift", key: "shift", placeholder: "Morning / Afternoon" },
                { label: "Email", key: "email", placeholder: "e.g. okafor@school.edu" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</label>
                  <input placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "8px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: "#c8a96e", color: "#0f1117", padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}>Save →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}