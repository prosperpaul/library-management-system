"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

const PAGE_SIZE = 10;
const SHIFTS = ["Morning", "Afternoon", "Evening", "Night"];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1c202c",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
  padding: "10px 12px", color: "#f0ece4", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const shiftColors: Record<string, { bg: string; color: string }> = {
  Morning:   { bg: "rgba(200,169,110,0.12)", color: "#c8a96e" },
  Afternoon: { bg: "rgba(90,141,238,0.12)",  color: "#5a8dee" },
  Evening:   { bg: "rgba(155,89,182,0.12)",  color: "#9b59b6" },
  Night:     { bg: "rgba(76,175,130,0.12)",  color: "#4caf82" },
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          {[55, 35, 45, 55, 50].map((w, j) => (
            <td key={j} style={{ padding: "14px 12px" }}>
              <div className="skeleton" style={{ height: "13px", width: `${w}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AttendantsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [attendants, setAttendants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", staffId: "", shift: "", email: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchAttendants = async () => {
    setLoading(true);
    try {
      const data = await api.get("/attendants");
      setAttendants(data.attendants || data || []);
    } catch (e: any) {
      setToast({ message: e.message || "Failed to load attendants.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendants(); }, []);

  const filtered = attendants.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.staffId?.toLowerCase().includes(search.toLowerCase()) ||
    a.shift?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = async () => {
    setFormError("");
    if (!form.name.trim())   { setFormError("Full name is required."); return; }
    if (!form.staffId.trim()) { setFormError("Staff ID is required."); return; }
    setSubmitting(true);
    try {
      await api.post("/attendants", { name: form.name, staffId: form.staffId, shift: form.shift, email: form.email });
      setShowModal(false);
      setForm({ name: "", staffId: "", shift: "", email: "" });
      setToast({ message: "Attendant added successfully!", type: "success" });
      fetchAttendants();
    } catch (e: any) {
      setFormError(e.message || "Failed to add attendant.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/attendants/${confirmDelete.id}`);
      setToast({ message: "Attendant removed.", type: "success" });
      fetchAttendants();
    } catch (e: any) {
      setToast({ message: e.message || "Failed to delete attendant.", type: "error" });
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Remove Attendant"
          message={`Are you sure you want to remove "${confirmDelete.name}" from the system?`}
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <Topbar title="Attendants" onAdd={isAdmin ? () => { setForm({ name: "", staffId: "", shift: "", email: "" }); setFormError(""); setShowModal(true); } : undefined} />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
            <svg width="14" height="14" fill="none" stroke="#5a5f78" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search by name, ID, or shift..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, background: "#14171f", paddingLeft: "36px", width: "100%" }}
            />
          </div>
          {!loading && <span style={{ fontSize: "13px", color: "#5a5f78" }}>{filtered.length} attendant{filtered.length !== 1 ? "s" : ""}</span>}
        </div>

        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "480px" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Name", "Staff ID", "Shift", "Email", ...(isAdmin ? ["Actions"] : [])].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: "10.5px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.2px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton /> : paginated.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 5 : 4} style={{ padding: "60px 12px", textAlign: "center", color: "#5a5f78" }}>No attendants found.</td></tr>
                ) : paginated.map((a: any) => {
                  const shiftStyle = shiftColors[a.shift] || shiftColors["Morning"];
                  return (
                    <tr key={a._id} className="table-row">
                      <td style={{ padding: "13px 14px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{a.name}</td>
                      <td style={{ padding: "13px 14px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "monospace", fontSize: "12px" }}>{a.staffId || "—"}</td>
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: shiftStyle.bg, color: shiftStyle.color }}>
                          {a.shift || "Morning"}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{a.email || "—"}</td>
                      {isAdmin && (
                        <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <button className="btn-danger" onClick={() => setConfirmDelete({ id: a._id, name: a.name })}
                            style={{ background: "none", border: "1px solid rgba(224,85,85,0.25)", color: "#e05555", padding: "4px 12px", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: "8px", padding: "14px 16px", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary"
                style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: page === 1 ? "#3a3f52" : "#8a8fa8", padding: "6px 14px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>← Prev</button>
              <span style={{ padding: "6px 10px", fontSize: "13px", color: "#5a5f78" }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary"
                style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: page === totalPages ? "#3a3f52" : "#8a8fa8", padding: "6px 14px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>Next →</button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}>
          <div className="anim-scale-in modal-inner" style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", width: "460px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "19px", color: "#f0ece4" }}>Add Attendant</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 26px" }}>
              {formError && (
                <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#f07070", fontSize: "13px" }}>
                  {formError}
                </div>
              )}
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Mrs. Okafor", required: true },
                { label: "Staff ID", key: "staffId", placeholder: "e.g. ATT-001", required: true },
                { label: "Email", key: "email", placeholder: "e.g. okafor@school.edu", type: "email" },
              ].map(({ label, key, placeholder, required, type }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>
                    {label} {required && <span style={{ color: "#e05555" }}>*</span>}
                  </label>
                  <input type={type || "text"} placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>Shift</label>
                <select value={form.shift} onChange={(e) => setForm(f => ({ ...f, shift: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: "dark" }}>
                  <option value="">Select shift...</option>
                  {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: "14px 26px 22px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary"
                style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "9px 18px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="btn-primary"
                style={{ background: "#c8a96e", color: "#0f1117", padding: "9px 22px", borderRadius: "9px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Saving..." : "Add Attendant →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
