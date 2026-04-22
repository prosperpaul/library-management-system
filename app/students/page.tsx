"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";

const PAGE_SIZE = 12;
const avatarColors = ["#5a8dee", "#c8a96e", "#4caf82", "#9b59b6", "#e67e22", "#e05555", "#1abc9c", "#e91e8c"];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: "8px",
  padding: "10px 12px", color: "var(--text)", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

function CardSkeleton() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <div className="skeleton" style={{ width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: "13px", width: "65%", marginBottom: "7px" }} />
          <div className="skeleton" style={{ height: "11px", width: "40%" }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: "22px", width: "70px", borderRadius: "20px" }} />
    </div>
  );
}

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", studentId: "", department: "", email: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.get("/students");
      setStudents(data.students || data || []);
    } catch (e: any) {
      setToast({ message: e.message || "Failed to load students.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = async () => {
    setFormError("");
    if (!form.name.trim())      { setFormError("Full name is required."); return; }
    if (!form.studentId.trim()) { setFormError("Student ID is required."); return; }
    setSubmitting(true);
    try {
      await api.post("/students", { name: form.name, studentId: form.studentId, department: form.department, email: form.email });
      setShowModal(false);
      setForm({ name: "", studentId: "", department: "", email: "" });
      setToast({ message: "Student registered successfully!", type: "success" });
      fetchStudents();
    } catch (e: any) {
      setFormError(e.message || "Failed to add student.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Topbar title="Students" onAdd={isAdmin ? () => { setForm({ name: "", studentId: "", department: "", email: "" }); setFormError(""); setShowModal(true); } : undefined} />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Search + count */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
            <svg width="14" height="14" fill="none" stroke="var(--text-dim)" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search name, ID, or department..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, background: "var(--surface)", paddingLeft: "36px", width: "100%" }}
            />
          </div>
          {!loading && (
            <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>
              {filtered.length} student{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Cards grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" }}>
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-dim)" }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" style={{ marginBottom: "16px", opacity: 0.4 }}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "6px" }}>No students found</div>
            <div style={{ fontSize: "13px" }}>{search ? `Try a different search term` : isAdmin ? "Add the first student using the button above" : "No students registered yet"}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" }}>
              {paginated.map((s: any) => {
                const initials = s.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                const color = avatarColors[students.indexOf(s) % avatarColors.length];
                return (
                  <div key={s._id} className="person-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: color + "22", border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color, flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "1px" }}>{s.studentId || s._id?.slice(-6)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 500, background: "rgba(90,141,238,0.1)", color: "#5a8dee" }}>
                        {s.department || "General"}
                      </span>
                      {s.email && (
                        <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: "var(--hover-bg)", color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                          {s.email}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: page === 1 ? "var(--text-disabled)" : "var(--text-muted)", padding: "6px 16px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>
                  ← Prev
                </button>
                <span style={{ padding: "6px 12px", fontSize: "13px", color: "var(--text-dim)" }}>Page {page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: page === totalPages ? "var(--text-disabled)" : "var(--text-muted)", padding: "6px 16px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}>
          <div className="anim-scale-in modal-inner" style={{ background: "var(--surface)", border: "1px solid var(--border-hover)", borderRadius: "18px", width: "460px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "19px", color: "var(--text)" }}>Register Student</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 26px" }}>
              {formError && (
                <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#f07070", fontSize: "13px" }}>
                  {formError}
                </div>
              )}
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Emeka Obi", required: true },
                { label: "Student ID", key: "studentId", placeholder: "e.g. STU-001", required: true },
                { label: "Department", key: "department", placeholder: "e.g. Computer Science" },
                { label: "Email", key: "email", placeholder: "e.g. emeka@school.edu", type: "email" },
              ].map(({ label, key, placeholder, required, type }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>
                    {label} {required && <span style={{ color: "#e05555" }}>*</span>}
                  </label>
                  <input type={type || "text"} placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 26px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "9px 18px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="btn-primary"
                style={{ background: "#c8a96e", color: "var(--bg)", padding: "9px 22px", borderRadius: "9px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Saving..." : "Register →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
