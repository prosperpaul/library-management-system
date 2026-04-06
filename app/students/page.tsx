"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";

const avatarColors = ["#5a8dee","#c8a96e","#4caf82","#9b59b6","#e67e22","#e05555","#1abc9c"];

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", studentId: "", department: "", email: "" });

  const fetchStudents = async () => {
    setLoading(true);
    const data = await api.get("/students");
    setStudents(data.students || data || []);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async () => {
    await api.post("/students", form);
    setShowModal(false);
    setForm({ name: "", studentId: "", department: "", email: "" });
    fetchStudents();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title="Students" onAdd={() => setShowModal(true)} />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
        {loading ? (
          <div style={{ color: "#5a5f78", padding: "60px", textAlign: "center" }}>Loading students...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
            {students.map((s: any, i: number) => {
              const initials = s.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
              const color = avatarColors[i % avatarColors.length];
              return (
                <div key={s._id} style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 600, color: "#0f1117", flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0ece4" }}>{s.name}</div>
                      <div style={{ fontSize: "11px", color: "#5a5f78" }}>{s.studentId || s._id?.slice(-6)}</div>
                    </div>
                  </div>
                  <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "11px", background: "rgba(90,141,238,0.15)", color: "#5a8dee" }}>
                    {s.department || "General"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", width: "440px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "18px", color: "#f0ece4" }}>Add New Student</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Emeka Obi" },
                { label: "Student ID", key: "studentId", placeholder: "e.g. STU-001" },
                { label: "Department", key: "department", placeholder: "e.g. Science" },
                { label: "Email", key: "email", placeholder: "e.g. emeka@school.edu" },
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