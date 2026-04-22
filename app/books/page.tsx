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

function coverGradient(title: string): string {
  const hash = Array.from(title).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const hue = Math.abs(hash) % 360;
  const hue2 = (hue + 45) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 32%, 22%) 0%, hsl(${hue2}, 28%, 14%) 100%)`;
}

function BookCover({ title }: { title: string }) {
  const letter = (title?.[0] || "?").toUpperCase();
  return (
    <div style={{
      width: "70px", height: "96px", borderRadius: "7px", flexShrink: 0,
      background: coverGradient(title || "?"),
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
      boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08)",
      overflow: "hidden",
    }}>
      {/* Subtle spine line */}
      <div style={{ position: "absolute", left: "7px", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.07)" }} />
      <span style={{
        fontFamily: "serif", fontStyle: "italic", fontSize: "30px",
        color: "rgba(240, 236, 228, 0.85)", lineHeight: 1,
      }}>{letter}</span>
    </div>
  );
}

type FilterKey = "all" | "available" | "borrowed";

export default function BooksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorsLoading, setAuthorsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", isbn: "", author: "", publishedYear: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const visibleBooks = books.filter((b: any) => {
    if (filter === "available") return !b.isBorrowed;
    if (filter === "borrowed")  return !!b.isBorrowed;
    return true;
  });

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
        <div style={{ marginBottom: "16px" }}>
          <div style={{ position: "relative", width: isMobile ? "100%" : "300px", maxWidth: "100%" }}>
            <svg width="14" height="14" fill="none" stroke="#5a5f78" strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                ...inputStyle,
                background: "#1c202c",
                paddingLeft: "40px",
                paddingRight: "14px",
                height: isMobile ? "46px" : "40px",
                borderRadius: isMobile ? "12px" : "10px",
                fontSize: isMobile ? "15px" : "14px",
              }}
            />
          </div>
        </div>

        {/* Mobile filter chips */}
        {isMobile && (
          <div style={{
            display: "flex", gap: "8px", marginBottom: "20px",
            overflowX: "auto", paddingBottom: "4px",
            scrollbarWidth: "none",
          }}>
            {([
              { key: "all", label: "All Books" },
              { key: "available", label: "Available" },
              { key: "borrowed", label: "Borrowed" },
            ] as { key: FilterKey; label: string }[]).map(chip => {
              const active = filter === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    background: active ? "#c8a96e" : "#1c202c",
                    color: active ? "#0f1117" : "#8a8fa8",
                    border: active ? "1px solid #c8a96e" : "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── Mobile: card list ─── */}
        {isMobile ? (
          loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "14px", display: "flex", gap: "14px" }}>
                  <div className="skeleton" style={{ width: "70px", height: "96px", borderRadius: "7px" }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: "14px", width: "75%", marginBottom: "10px" }} />
                    <div className="skeleton" style={{ height: "11px", width: "50%", marginBottom: "12px" }} />
                    <div className="skeleton" style={{ height: "9px", width: "65%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleBooks.length === 0 ? (
            <div style={{
              padding: "50px 20px", textAlign: "center",
              background: "#14171f", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
            }}>
              <svg width="40" height="40" fill="none" stroke="#5a5f78" strokeWidth="1.4" viewBox="0 0 24 24" style={{ marginBottom: "14px", opacity: 0.5 }}>
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              </svg>
              <div style={{ fontSize: "14px", color: "#8a8fa8" }}>
                No books found{search ? ` for "${search}"` : filter !== "all" ? ` in ${filter}` : ""}.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {visibleBooks.map((book: any) => (
                <div key={book._id} style={{
                  background: "#14171f",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "14px",
                  display: "flex",
                  gap: "14px",
                  transition: "transform 0.15s",
                }}>
                  <BookCover title={book.title} />

                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                        <div style={{
                          fontFamily: "serif", fontStyle: "italic",
                          fontSize: "17px", color: "#f0ece4", lineHeight: 1.25,
                          overflow: "hidden", textOverflow: "ellipsis",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        }}>
                          {book.title}
                        </div>
                        <span style={{
                          padding: "2px 8px", borderRadius: "4px",
                          fontSize: "9px", fontWeight: 700, letterSpacing: "1px",
                          flexShrink: 0, textTransform: "uppercase",
                          background: book.isBorrowed ? "rgba(186, 199, 242, 0.1)" : "rgba(200, 169, 110, 0.12)",
                          color: book.isBorrowed ? "#bac7f2" : "#c8a96e",
                          border: `1px solid ${book.isBorrowed ? "rgba(186, 199, 242, 0.2)" : "rgba(200, 169, 110, 0.2)"}`,
                        }}>
                          {book.isBorrowed ? "Out" : "Available"}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#8a8fa8", marginTop: "6px" }}>
                        {book.author?.name || book.author || "—"}
                      </div>
                      {book.isbn && (
                        <div style={{ fontSize: "10px", color: "#5a5f78", marginTop: "8px", letterSpacing: "1px", fontFamily: "ui-monospace, monospace" }}>
                          ISBN · {book.isbn}
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                        <button
                          onClick={() => setConfirmDelete({ id: book._id, title: book.title })}
                          aria-label="Delete book"
                          style={{
                            background: "none", border: "none",
                            color: "#5a5f78", cursor: "pointer",
                            padding: "4px", display: "flex", alignItems: "center",
                          }}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "10px 0 4px" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: page === 1 ? "#3a3f52" : "#8a8fa8", padding: "8px 14px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                  ← Prev
                </button>
                <span style={{ padding: "6px 10px", fontSize: "13px", color: "#5a5f78" }}>Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={books.length < 10}
                  style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: books.length < 10 ? "#3a3f52" : "#8a8fa8", padding: "8px 14px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", cursor: books.length < 10 ? "not-allowed" : "pointer" }}>
                  Next →
                </button>
              </div>
            </div>
          )
        ) : (
          /* ─── Desktop: table ─── */
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
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: "20px" }}
          onClick={() => setShowModal(false)}>
          <div className="anim-scale-in modal-inner" style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", width: "460px", maxWidth: "100%" }}
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
                {submitting ? "Saving..." : "Save Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
