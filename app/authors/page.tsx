"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

const PAGE_SIZE = 10;

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: "8px",
  padding: "10px 12px", color: "var(--text)", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          {[55, 40, 75, 50].map((w, j) => (
            <td key={j} style={{ padding: "14px 12px" }}>
              <div className="skeleton" style={{ height: "13px", width: `${w}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AuthorsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", nationality: "", bio: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await api.get("/authors");
      setAuthors(data.authors || data || []);
    } catch (e: any) {
      setToast({ message: e.message || "Failed to load authors.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuthors(); }, []);

  const filtered = authors.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.nationality?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = async () => {
    setFormError("");
    if (!form.name.trim()) { setFormError("Full name is required."); return; }
    setSubmitting(true);
    try {
      await api.post("/authors", { name: form.name, nationality: form.nationality, bio: form.bio });
      setShowModal(false);
      setForm({ name: "", nationality: "", bio: "" });
      setToast({ message: "Author added successfully!", type: "success" });
      fetchAuthors();
    } catch (e: any) {
      setFormError(e.message || "Failed to add author.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/authors/${confirmDelete.id}`);
      setToast({ message: "Author deleted.", type: "success" });
      fetchAuthors();
    } catch (e: any) {
      setToast({ message: e.message || "Failed to delete author.", type: "error" });
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Author"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This will not delete their books.`}
          confirmLabel="Delete Author"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <Topbar title="Authors" onAdd={isAdmin ? () => { setForm({ name: "", nationality: "", bio: "" }); setFormError(""); setShowModal(true); } : undefined} />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Search + count */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
            <svg width="14" height="14" fill="none" stroke="var(--text-dim)" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search by name or nationality..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, background: "var(--surface)", paddingLeft: "36px", width: "100%" }}
            />
          </div>
          {!loading && <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>{filtered.length} author{filtered.length !== 1 ? "s" : ""}</span>}
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "480px" }}>
              <thead>
                <tr style={{ background: "var(--hover-bg-soft)" }}>
                  {["Name", "Nationality", "Bio", ...(isAdmin ? ["Actions"] : [])].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: "10.5px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1.2px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton /> : paginated.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 4 : 3} style={{ padding: "60px 12px", textAlign: "center", color: "var(--text-dim)" }}>No authors found.</td></tr>
                ) : paginated.map((author: any) => (
                  <tr key={author._id} className="table-row">
                    <td style={{ padding: "13px 14px", color: "var(--text)", fontWeight: 500, borderBottom: "1px solid var(--hover-bg)" }}>{author.name}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--hover-bg)" }}>
                      {author.nationality ? (
                        <span style={{ padding: "2px 9px", borderRadius: "20px", fontSize: "11px", background: "rgba(90,141,238,0.1)", color: "#5a8dee" }}>{author.nationality}</span>
                      ) : <span style={{ color: "var(--text-dim)" }}>—</span>}
                    </td>
                    <td style={{ padding: "13px 14px", color: "var(--text-muted)", borderBottom: "1px solid var(--hover-bg)", maxWidth: "280px" }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{author.bio || "—"}</span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--hover-bg)" }}>
                        <button className="btn-danger" onClick={() => setConfirmDelete({ id: author._id, name: author.name })}
                          style={{ background: "none", border: "1px solid rgba(224,85,85,0.25)", color: "#e05555", padding: "4px 12px", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: "8px", padding: "14px 16px", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid var(--hover-bg)" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: page === 1 ? "var(--text-disabled)" : "var(--text-muted)", padding: "6px 14px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>
                ← Prev
              </button>
              <span style={{ padding: "6px 10px", fontSize: "13px", color: "var(--text-dim)" }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: page === totalPages ? "var(--text-disabled)" : "var(--text-muted)", padding: "6px 14px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}>
          <div className="anim-scale-in modal-inner" style={{ background: "var(--surface)", border: "1px solid var(--border-hover)", borderRadius: "18px", width: "460px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "19px", color: "var(--text)" }}>Add New Author</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 26px" }}>
              {formError && (
                <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#f07070", fontSize: "13px" }}>
                  {formError}
                </div>
              )}
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Chinua Achebe", required: true },
                { label: "Nationality", key: "nationality", placeholder: "e.g. Nigerian", required: false },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>
                    {label} {required && <span style={{ color: "#e05555" }}>*</span>}
                  </label>
                  <input placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>Bio</label>
                <textarea placeholder="Short biography..." value={form.bio} rows={3}
                  onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
            <div style={{ padding: "14px 26px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "9px 18px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="btn-primary"
                style={{ background: "#c8a96e", color: "var(--bg)", padding: "9px 22px", borderRadius: "9px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Saving..." : "Save Author →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
