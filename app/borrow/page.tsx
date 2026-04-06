"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";

export default function BorrowPage() {
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ bookId: "", studentId: "", attendantId: "", returnDate: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/books/overdue").then((data) => {
      setOverdue(data || []);
      setLoading(false);
    });
  }, []);

  const handleBorrow = async () => {
    const data = await api.post(`/books/${form.bookId}/borrow`, {
      studentId: form.studentId,
      attendantId: form.attendantId,
      returnDate: form.returnDate,
    });
    setMessage(data.message || "Book borrowed successfully!");
    setShowModal(false);
    setForm({ bookId: "", studentId: "", attendantId: "", returnDate: "" });
  };

  const handleReturn = async (bookId: string) => {
    const data = await api.post(`/books/${bookId}/return`, {});
    setMessage(data.message || "Book returned successfully!");
    const updated = await api.get("/books/overdue");
    setOverdue(updated || []);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title="Borrow & Return" onAdd={() => setShowModal(true)} addLabel="+ Borrow Book" />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>

        {message && (
          <div style={{ background: "rgba(76,175,130,0.15)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#4caf82", fontSize: "14px" }}>
            {message}
            <button onClick={() => setMessage("")} style={{ float: "right", background: "none", border: "none", color: "#4caf82", cursor: "pointer" }}>✕</button>
          </div>
        )}

        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0ece4" }}>Overdue Books</div>
            <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "11px", background: "rgba(224,85,85,0.15)", color: "#e05555" }}>{overdue.length} overdue</span>
          </div>
          {loading ? (
            <div style={{ color: "#5a5f78", padding: "40px", textAlign: "center" }}>Loading...</div>
          ) : overdue.length === 0 ? (
            <div style={{ color: "#5a5f78", padding: "40px", textAlign: "center", fontSize: "14px" }}>No overdue books 🎉</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Book", "Borrowed By", "Due Date", "Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overdue.map((book: any) => (
                  <tr key={book._id}>
                    <td style={{ padding: "12px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.title}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.borrowedBy?.name || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: "#e05555", fontSize: "12px" }}>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "—"}</span>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <button onClick={() => handleReturn(book._id)}
                        style={{ background: "none", border: "1px solid rgba(76,175,130,0.4)", color: "#4caf82", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                        Mark Returned
                      </button>
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
              <h2 style={{ fontFamily: "serif", fontSize: "18px", color: "#f0ece4" }}>Borrow a Book</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[
                { label: "Book ID", key: "bookId", placeholder: "MongoDB Book ID", type: "text" },
                { label: "Student ID", key: "studentId", placeholder: "MongoDB Student ID", type: "text" },
                { label: "Attendant ID", key: "attendantId", placeholder: "MongoDB Attendant ID", type: "text" },
                { label: "Return Date", key: "returnDate", placeholder: "", type: "date" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", colorScheme: "dark" }} />
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "8px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>Cancel</button>
              <button onClick={handleBorrow} style={{ background: "#c8a96e", color: "#0f1117", padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}>Confirm Borrow →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}