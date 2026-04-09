"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1c202c",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
  padding: "10px 12px", color: "#f0ece4", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color 0.15s",
};

function SearchSelect({ options, value, onChange, placeholder, loading: optLoading }: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  loading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ position: "relative" }}>
      <input
        value={open ? search : selected?.label || ""}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => { setOpen(true); setSearch(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={optLoading ? "Loading authors..." : placeholder}
        disabled={optLoading}
        style={{ ...inputStyle, opacity: optLoading ? 0.5 : 1 }}
      />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1c202c", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "9px", maxHeight: "200px", overflowY: "auto", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "12px", color: "#5a5f78", fontSize: "13px", textAlign: "center" }}>No results</div>
          ) : filtered.map((o) => (
            <div key={o.id} onMouseDown={() => { onChange(o.id); setOpen(false); setSearch(""); }}
              style={{ padding: "10px 14px", color: o.id === value ? "#c8a96e" : "#f0ece4", cursor: "pointer", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: o.id === value ? "rgba(200,169,110,0.08)" : "transparent", transition: "background 0.1s" }}
              onMouseEnter={e => { if (o.id !== value) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (o.id !== value) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <tr key={i}>
          {[70, 50, 40, 30, 55, 50].map((w, j) => (
            <td key={j} style={{ padding: "14px 12px" }}>
              <div className="skeleton" style={{ height: "13px", width: `${w}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function BooksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", isbn: "", author: "", publishedYear: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/books?page=${page}&limit=10&search=${search}`);
      setBooks(data.books || data || []);
    } catch (e: any) {
      setToast({ message: e.message || "Failed to load books.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [page, search]);

  useEffect(() => {
    setAuthorsLoading(true);
    api.get("/authors").then((data) => {
      const list = data.authors || data || [];
      setAuthors(list.map((a: any) => ({ id: a._id, label: a.name })));
    }).catch(() => {}).finally(() => setAuthorsLoading(false));
  }, []);

  const handleAdd = async () => {
    setFormError("");
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    if (!form.author)       { setFormError("Please select an author."); return; }
    setSubmitting(true);
    try {
      await api.post("/books", {
        title: form.title, isbn: form.isbn, author: form.author,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
      });
      setShowModal(false);
      setForm({ title: "", isbn: "", author: "", publishedYear: "" });
      setToast({ message: "Book added successfully!", type: "success" });
      fetchBooks();
    } catch (e: any) {
      setFormError(e.message || "Failed to add book.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/books/${confirmDelete.id}`);
      setToast({ message: "Book deleted.", type: "success" });
      fetchBooks();
    } catch (e: any) {
      setToast({ message: e.message || "Failed to delete book.", type: "error" });
    } finally {
      setConfirmDelete(null);
    }
  };

  const openModal = () => {
    setForm({ title: "", isbn: "", author: "", publishedYear: "" });
    setFormError("");
    setShowModal(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Book"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          confirmLabel="Delete Book"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <Topbar title="Books" onAdd={isAdmin ? openModal : undefined} />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Search */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative", display: "inline-block", width: "300px", maxWidth: "100%" }}>
            <svg width="14" height="14" fill="none" stroke="#5a5f78" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ ...inputStyle, background: "#14171f", paddingLeft: "36px", width: "100%" }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "560px" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Title", "Author", "ISBN", "Year", "Status", ...(isAdmin ? ["Actions"] : [])].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: "10.5px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.2px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton /> : books.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 6 : 5} style={{ padding: "60px 12px", textAlign: "center", color: "#5a5f78" }}>
                    No books found{search ? ` for "${search}"` : ""}.</td></tr>
                ) : books.map((book: any) => (
                  <tr key={book._id} className="table-row">
                    <td style={{ padding: "13px 14px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.title}</td>
                    <td style={{ padding: "13px 14px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.author?.name || book.author || "—"}</td>
                    <td style={{ padding: "13px 14px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.isbn || "—"}</td>
                    <td style={{ padding: "13px 14px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.publishedYear || "—"}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: book.isBorrowed ? "rgba(90,141,238,0.12)" : "rgba(76,175,130,0.12)", color: book.isBorrowed ? "#5a8dee" : "#4caf82" }}>
                        {book.isBorrowed ? "Borrowed" : "Available"}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <button className="btn-danger" onClick={() => setConfirmDelete({ id: book._id, title: book.title })}
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

          {/* Pagination */}
          <div style={{ display: "flex", gap: "8px", padding: "14px 16px", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary"
              style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: page === 1 ? "#3a3f52" : "#8a8fa8", padding: "6px 14px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>
              ← Prev
            </button>
            <span style={{ padding: "6px 10px", fontSize: "13px", color: "#5a5f78" }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={books.length < 10} className="btn-secondary"
              style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: books.length < 10 ? "#3a3f52" : "#8a8fa8", padding: "6px 14px", borderRadius: "7px", fontFamily: "inherit", fontSize: "13px" }}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}>
          <div className="anim-scale-in modal-inner" style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", width: "460px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "19px", color: "#f0ece4" }}>Add New Book</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: "20px 26px" }}>
              {formError && (
                <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#f07070", fontSize: "13px" }}>
                  {formError}
                </div>
              )}
              {[
                { label: "Title", key: "title", placeholder: "e.g. Things Fall Apart", required: true },
                { label: "ISBN", key: "isbn", placeholder: "e.g. 978-0385474542", required: false },
                { label: "Published Year", key: "publishedYear", placeholder: "e.g. 1958", required: false, type: "number" },
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
                <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>
                  Author <span style={{ color: "#e05555" }}>*</span>
                </label>
                <SearchSelect options={authors} value={form.author}
                  onChange={(id) => setForm(f => ({ ...f, author: id }))}
                  placeholder="Search for an author..." loading={authorsLoading} />
              </div>
            </div>
            <div style={{ padding: "14px 26px 22px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary"
                style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "9px 18px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleAdd} disabled={submitting} className="btn-primary"
                style={{ background: "#c8a96e", color: "#0f1117", padding: "9px 22px", borderRadius: "9px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Saving..." : "Save Book →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
