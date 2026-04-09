"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import Toast from "@/components/ui/Toast";

function StatCard({ label, value, sub, dotColor, loading }: {
  label: string; value: number | string; sub: string; dotColor: string; loading: boolean;
}) {
  if (loading) {
    return (
      <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
        <div className="skeleton" style={{ height: "11px", width: "55%", marginBottom: "14px" }} />
        <div className="skeleton" style={{ height: "34px", width: "45%", marginBottom: "12px" }} />
        <div className="skeleton" style={{ height: "11px", width: "60%" }} />
      </div>
    );
  }
  return (
    <div className="stat-card" style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
      <div style={{ fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "12px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "serif", fontSize: "34px", color: "#f0ece4", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#8a8fa8", marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
        {sub}
      </div>
    </div>
  );
}

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={{ padding: "14px 12px" }}>
              <div className="skeleton" style={{ height: "13px", width: j === 0 ? "65%" : j === cols - 1 ? "55px" : "50%" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function DashboardPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    Promise.all([
      api.get("/books?limit=5"),
      api.get("/students"),
      api.get("/books/overdue"),
    ]).then(([booksData, studentsData, overdueData]) => {
      setBooks(booksData.books || booksData || []);
      setStudents(studentsData.students || studentsData || []);
      setOverdue(overdueData || []);
    }).catch((e) => {
      setToast({ message: e.message || "Failed to load dashboard data.", type: "error" });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Topbar title="Dashboard" />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" }}>
          <StatCard loading={loading} label="Total Books"    value={books.length}                              sub="In the library"  dotColor="#4caf82" />
          <StatCard loading={loading} label="Students"       value={students.length}                           sub="Registered"      dotColor="#5a8dee" />
          <StatCard loading={loading} label="Overdue"        value={overdue.length}                            sub="Need follow-up"  dotColor="#e05555" />
          <StatCard loading={loading} label="Available"      value={books.filter((b: any) => !b.isBorrowed).length} sub="Ready to borrow" dotColor="#c8a96e" />
        </div>

        {/* Recent Books */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#f0ece4" }}>Recent Books</div>
            {!loading && books.length > 0 && (
              <span style={{ fontSize: "12px", color: "#5a5f78" }}>{books.length} shown</span>
            )}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "480px" }}>
              <thead>
                <tr>
                  {["Title", "Author", "ISBN", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={4} /> : books.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: "40px 12px", textAlign: "center", color: "#5a5f78", fontSize: "13px" }}>No books yet.</td></tr>
                ) : books.slice(0, 5).map((book: any) => (
                  <tr key={book._id} className="table-row">
                    <td style={{ padding: "13px 12px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.title}</td>
                    <td style={{ padding: "13px 12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.author?.name || book.author || "—"}</td>
                    <td style={{ padding: "13px 12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.isbn || "—"}</td>
                    <td style={{ padding: "13px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: book.isBorrowed ? "rgba(90,141,238,0.12)" : "rgba(76,175,130,0.12)", color: book.isBorrowed ? "#5a8dee" : "#4caf82" }}>
                        {book.isBorrowed ? "Borrowed" : "Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#f0ece4" }}>Overdue Books</div>
            {!loading && (
              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: overdue.length > 0 ? "rgba(224,85,85,0.12)" : "rgba(76,175,130,0.12)", color: overdue.length > 0 ? "#e05555" : "#4caf82" }}>
                {overdue.length} overdue
              </span>
            )}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "380px" }}>
              <thead>
                <tr>
                  {["Book", "Student", "Due Date", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={4} /> : overdue.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: "40px 12px", textAlign: "center", color: "#5a5f78", fontSize: "13px" }}>All clear — no overdue books.</td></tr>
                ) : overdue.slice(0, 5).map((book: any) => (
                  <tr key={book._id} className="table-row">
                    <td style={{ padding: "13px 12px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.title}</td>
                    <td style={{ padding: "13px 12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{book.borrowedBy?.name || "—"}</td>
                    <td style={{ padding: "13px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: "#e05555", fontSize: "12px" }}>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "—"}</span>
                    </td>
                    <td style={{ padding: "13px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: "rgba(224,85,85,0.12)", color: "#e05555" }}>Overdue</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
