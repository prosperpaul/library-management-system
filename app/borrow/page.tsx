"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import Toast from "@/components/ui/Toast";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: "8px",
  padding: "10px 12px", color: "var(--text)", fontSize: "14px",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
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
        placeholder={optLoading ? "Loading..." : placeholder}
        disabled={optLoading}
        style={{ ...inputStyle, opacity: optLoading ? 0.5 : 1 }}
      />
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "var(--surface2)", border: "1px solid var(--border-hover)", borderRadius: "9px", maxHeight: "200px", overflowY: "auto", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "12px", color: "var(--text-dim)", fontSize: "13px", textAlign: "center" }}>No results</div>
          ) : filtered.map((o) => (
            <div key={o.id} onMouseDown={() => { onChange(o.id); setOpen(false); setSearch(""); }}
              style={{ padding: "10px 14px", color: o.id === value ? "#c8a96e" : "var(--text)", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid var(--hover-bg)", background: o.id === value ? "rgba(200,169,110,0.08)" : "transparent" }}
              onMouseEnter={e => { if (o.id !== value) (e.currentTarget as HTMLDivElement).style.background = "var(--hover-bg)"; }}
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

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={{ padding: "14px 12px" }}>
              <div className="skeleton" style={{ height: "13px", width: j === 0 ? "65%" : "50%" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function BorrowPage() {
  const [borrowed, setBorrowed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [availableBooks, setAvailableBooks] = useState<{ id: string; label: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; label: string }[]>([]);
  const [attendants, setAttendants] = useState<{ id: string; label: string }[]>([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bookId: "", studentId: "", attendantId: "", returnDate: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const fetchBorrowed = async () => {
    setLoading(true);
    try {
      const data = await api.get("/books?limit=500");
      const all = data.books || data || [];
      setBorrowed(all.filter((b: any) => b.isBorrowed));
    } catch (e: any) {
      setToast({ message: e.message || "Failed to load data.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBorrowed(); }, []);

  const loadDropdowns = async () => {
    setDropdownsLoading(true);
    try {
      const [booksData, studentsData, attendantsData] = await Promise.all([
        api.get("/books?limit=500"),
        api.get("/students"),
        api.get("/attendants"),
      ]);
      const allBooks = booksData.books || booksData || [];
      setAvailableBooks(allBooks.filter((b: any) => !b.isBorrowed).map((b: any) => ({ id: b._id, label: b.title })));
      const allStudents = studentsData.students || studentsData || [];
      setStudents(allStudents.map((s: any) => ({ id: s._id, label: `${s.name}  ·  ${s.studentId || s._id.slice(-5)}` })));
      const allAttendants = attendantsData.attendants || attendantsData || [];
      setAttendants(allAttendants.map((a: any) => ({ id: a._id, label: `${a.name}  ·  ${a.shift || "Morning"}` })));
    } catch { /* silently fail */ }
    finally { setDropdownsLoading(false); }
  };

  const openModal = () => {
    setForm({ bookId: "", studentId: "", attendantId: "", returnDate: "" });
    setFormError("");
    setShowModal(true);
    loadDropdowns();
  };

  const handleBorrow = async () => {
    setFormError("");
    if (!form.bookId)      { setFormError("Please select a book."); return; }
    if (!form.studentId)   { setFormError("Please select a student."); return; }
    if (!form.attendantId) { setFormError("Please select an attendant."); return; }
    if (!form.returnDate)  { setFormError("Please set a return date."); return; }
    setSubmitting(true);
    try {
      await api.post(`/books/${form.bookId}/borrow`, {
        studentId: form.studentId, attendantId: form.attendantId, returnDate: form.returnDate,
      });
      setShowModal(false);
      setToast({ message: "Book borrowed successfully!", type: "success" });
      fetchBorrowed();
    } catch (e: any) {
      setFormError(e.message || "Failed to borrow book.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (bookId: string) => {
    try {
      await api.post(`/books/${bookId}/return`, {});
      setToast({ message: "Book marked as returned.", type: "success" });
      fetchBorrowed();
    } catch (e: any) {
      setToast({ message: e.message || "Failed to return book.", type: "error" });
    }
  };

  const now = new Date();
  const overdue = borrowed.filter((b) => b.returnDate && new Date(b.returnDate) < now);
  const active  = borrowed.filter((b) => !b.returnDate || new Date(b.returnDate) >= now);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Topbar title="Borrow & Return" onAdd={openModal} addLabel="+ Borrow Book" />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Total Borrowed", value: borrowed.length, color: "#5a8dee", bg: "rgba(90,141,238,0.1)" },
            { label: "Active Loans",   value: active.length,   color: "#4caf82", bg: "rgba(76,175,130,0.1)" },
            { label: "Overdue",        value: overdue.length,  color: "#e05555", bg: "rgba(224,85,85,0.1)"  },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontWeight: 600 }}>{label}</div>
              <div style={{ fontFamily: "serif", fontSize: "28px", color: loading ? "var(--text-dim)" : "var(--text)" }}>
                {loading ? "—" : value}
              </div>
              <div style={{ marginTop: "6px", display: "inline-block", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: bg, color }}>{label.split(" ")[0]}</div>
            </div>
          ))}
        </div>

        {/* Currently Borrowed */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", marginBottom: "18px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Currently Borrowed</div>
            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: "rgba(90,141,238,0.1)", color: "#5a8dee" }}>
              {loading ? "…" : active.length} active
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
              <thead>
                <tr style={{ background: "var(--hover-bg-soft)" }}>
                  {["Book", "Borrowed By", "Due Date", "Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 14px", fontSize: "10.5px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1.2px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={4} /> : active.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: "40px 14px", textAlign: "center", color: "var(--text-dim)" }}>No active borrows.</td></tr>
                ) : active.map((book: any) => (
                  <tr key={book._id} className="table-row">
                    <td style={{ padding: "13px 14px", color: "var(--text)", fontWeight: 500, borderBottom: "1px solid var(--hover-bg)" }}>{book.title}</td>
                    <td style={{ padding: "13px 14px", color: "var(--text-muted)", borderBottom: "1px solid var(--hover-bg)" }}>{book.borrowedBy?.name || "—"}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--hover-bg)" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {book.returnDate ? new Date(book.returnDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--hover-bg)" }}>
                      <button className="btn-success" onClick={() => handleReturn(book._id)}
                        style={{ background: "none", border: "1px solid rgba(76,175,130,0.3)", color: "#4caf82", padding: "4px 12px", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Overdue Books</div>
            <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: overdue.length > 0 ? "rgba(224,85,85,0.12)" : "rgba(76,175,130,0.12)", color: overdue.length > 0 ? "#e05555" : "#4caf82" }}>
              {loading ? "…" : overdue.length} overdue
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
              <thead>
                <tr style={{ background: "var(--hover-bg-soft)" }}>
                  {["Book", "Borrowed By", "Was Due", "Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "11px 14px", fontSize: "10.5px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1.2px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={4} /> : overdue.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: "40px 14px", textAlign: "center", color: "var(--text-dim)" }}>All clear — no overdue books.</td></tr>
                ) : overdue.map((book: any) => (
                  <tr key={book._id} className="table-row">
                    <td style={{ padding: "13px 14px", color: "var(--text)", fontWeight: 500, borderBottom: "1px solid var(--hover-bg)" }}>{book.title}</td>
                    <td style={{ padding: "13px 14px", color: "var(--text-muted)", borderBottom: "1px solid var(--hover-bg)" }}>{book.borrowedBy?.name || "—"}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--hover-bg)" }}>
                      <span style={{ fontSize: "12px", color: "#e05555", fontWeight: 500 }}>
                        {book.returnDate ? new Date(book.returnDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--hover-bg)" }}>
                      <button className="btn-success" onClick={() => handleReturn(book._id)}
                        style={{ background: "none", border: "1px solid rgba(76,175,130,0.3)", color: "#4caf82", padding: "4px 12px", borderRadius: "7px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                        Mark Returned
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Borrow Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => setShowModal(false)}>
          <div className="anim-scale-in modal-inner" style={{ background: "var(--surface)", border: "1px solid var(--border-hover)", borderRadius: "18px", width: "480px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "19px", color: "var(--text)" }}>Borrow a Book</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 26px" }}>
              {formError && (
                <div className="anim-slide-down" style={{ background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#f07070", fontSize: "13px" }}>
                  {formError}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>Book <span style={{ color: "#e05555" }}>*</span></label>
                <SearchSelect options={availableBooks} value={form.bookId}
                  onChange={(id) => setForm(f => ({ ...f, bookId: id }))}
                  placeholder="Search available books..." loading={dropdownsLoading} />
                {!dropdownsLoading && availableBooks.length === 0 && (
                  <div style={{ fontSize: "12px", color: "#e05555", marginTop: "6px" }}>No books currently available.</div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>Student <span style={{ color: "#e05555" }}>*</span></label>
                <SearchSelect options={students} value={form.studentId}
                  onChange={(id) => setForm(f => ({ ...f, studentId: id }))}
                  placeholder="Search students..." loading={dropdownsLoading} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>Attendant <span style={{ color: "#e05555" }}>*</span></label>
                <SearchSelect options={attendants} value={form.attendantId}
                  onChange={(id) => setForm(f => ({ ...f, attendantId: id }))}
                  placeholder="Search attendants..." loading={dropdownsLoading} />
              </div>

              <div style={{ marginBottom: "4px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "7px", fontWeight: 600 }}>Return Date <span style={{ color: "#e05555" }}>*</span></label>
                <input type="date" min={today} value={form.returnDate}
                  onChange={(e) => setForm(f => ({ ...f, returnDate: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: "dark" }} />
              </div>
            </div>
            <div style={{ padding: "14px 26px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "9px 18px", borderRadius: "9px", fontFamily: "inherit", fontSize: "13px", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleBorrow} disabled={submitting} className="btn-primary"
                style={{ background: "#c8a96e", color: "var(--bg)", padding: "9px 22px", borderRadius: "9px", border: "none", fontFamily: "inherit", fontSize: "13px", fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Processing..." : "Confirm Borrow →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
