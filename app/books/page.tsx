"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", isbn: "", author: "", publishedYear: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    const data = await api.get(`/books?page=${page}&limit=10&search=${search}`);
    setBooks(data.books || data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, [page, search]);

  const handleAdd = async () => {
    setSubmitting(true);
    await api.post("/books", form);
    setShowModal(false);
    setForm({ title: "", isbn: "", author: "", publishedYear: "" });
    fetchBooks();
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title="Books" onAdd={() => setShowModal(true)} />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>

        {/* Search */}
        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "10px 16px", color: "#f0ece4", fontSize: "14px", outline: "none", width: "300px", fontFamily: "inherit" }}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          {loading ? (
            <div style={{ color: "#5a5f78", padding: "40px", textAlign: "center" }}>Loading books...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Title", "Author", "ISBN", "Year", "Status", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map((book: any) => (
                  <tr key={book._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px", color: "#f0ece4", fontWeight: 500 }}>{book.title}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8" }}>{book.author?.name || book.author || "—"}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8" }}>{book.isbn || "—"}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8" }}>{book.publishedYear || "—"}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 500,
                        background: book.isBorrowed ? "rgba(90,141,238,0.15)" : "rgba(76,175,130,0.15)",
                        color: book.isBorrowed ? "#5a8dee" : "#4caf82",
                      }}>
                        {book.isBorrowed ? "Borrowed" : "Available"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleDelete(book._id)} style={{ background: "none", border: "1px solid rgba(224,85,85,0.3)", color: "#e05555", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "flex-end" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
              ← Prev
            </button>
            <span style={{ padding: "6px 14px", fontSize: "13px", color: "#5a5f78" }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)}
              style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "6px 14px", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", width: "440px", maxWidth: "95vw" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "18px", color: "#f0ece4" }}>Add New Book</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[
                { label: "Title", key: "title", placeholder: "e.g. Things Fall Apart" },
                { label: "ISBN", key: "isbn", placeholder: "e.g. 978-0385474542" },
                { label: "Author ID", key: "author", placeholder: "MongoDB Author ID" },
                { label: "Published Year", key: "publishedYear", placeholder: "e.g. 1958" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</label>
                  <input
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "8px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>Cancel</button>
              <button onClick={handleAdd} disabled={submitting} style={{ background: "#c8a96e", color: "#0f1117", padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}>
                {submitting ? "Saving..." : "Save →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}