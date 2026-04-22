"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";
import Toast from "@/components/ui/Toast";

type StatIcon = "book" | "group" | "swap" | "alert" | "check";

function iconSvg(icon: StatIcon) {
  const common = { width: 22, height: 22, fill: "none", stroke: "currentColor", strokeWidth: 1.7, viewBox: "0 0 24 24" } as const;
  switch (icon) {
    case "book":
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
    case "group":
      return <svg {...common}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    case "swap":
      return <svg {...common}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
    case "alert":
      return <svg {...common}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case "check":
      return <svg {...common}><polyline points="20 6 9 17 4 12"/></svg>;
  }
}

function DesktopStat({ label, value, sub, dotColor, loading }: {
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

function MobileStatRow({ label, value, icon, tone = "default", loading }: {
  label: string; value: number | string; icon: StatIcon;
  tone?: "default" | "danger"; loading: boolean;
}) {
  const isDanger = tone === "danger";
  if (loading) {
    return (
      <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: "10px", width: "45%", marginBottom: "10px" }} />
          <div className="skeleton" style={{ height: "24px", width: "30%" }} />
        </div>
        <div className="skeleton" style={{ width: "44px", height: "44px", borderRadius: "12px" }} />
      </div>
    );
  }
  return (
    <div className="stat-card" style={{
      background: isDanger ? "linear-gradient(100deg, #14171f, rgba(224,85,85,0.06))" : "#14171f",
      border: `1px solid ${isDanger ? "rgba(224,85,85,0.18)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "14px", padding: "18px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: "10px", letterSpacing: "1.2px", fontWeight: 600,
          color: isDanger ? "rgba(224,85,85,0.8)" : "#5a5f78",
          textTransform: "uppercase", marginBottom: "6px",
        }}>{label}</div>
        <div style={{
          fontFamily: "serif", fontSize: "26px", lineHeight: 1,
          color: isDanger ? "#e05555" : "#f0ece4",
        }}>{value}</div>
      </div>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isDanger ? "rgba(224,85,85,0.12)" : "rgba(200,169,110,0.1)",
        color: isDanger ? "#e05555" : "#c8a96e",
      }}>
        {iconSvg(icon)}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const availableCount = books.filter((b: any) => !b.isBorrowed).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Topbar title="Dashboard" />

      <div className="anim-fade-up" style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Mobile greeting */}
        {isMobile && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "#c8a96e", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>
              Dashboard
            </div>
            <div style={{ fontFamily: "serif", fontSize: "28px", color: "#f0ece4", lineHeight: 1.2 }}>
              Curation Overview
            </div>
          </div>
        )}

        {/* Stats */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            <MobileStatRow loading={loading} label="Total Books"    value={books.length}     icon="book" />
            <MobileStatRow loading={loading} label="Students"       value={students.length}  icon="group" />
            <MobileStatRow loading={loading} label="Available"      value={availableCount}   icon="check" />
            <MobileStatRow loading={loading} label="Overdue"        value={overdue.length}   icon="alert" tone="danger" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" }}>
            <DesktopStat loading={loading} label="Total Books"    value={books.length}                              sub="In the library"  dotColor="#4caf82" />
            <DesktopStat loading={loading} label="Students"       value={students.length}                           sub="Registered"      dotColor="#5a8dee" />
            <DesktopStat loading={loading} label="Overdue"        value={overdue.length}                            sub="Need follow-up"  dotColor="#e05555" />
            <DesktopStat loading={loading} label="Available"      value={availableCount}                            sub="Ready to borrow" dotColor="#c8a96e" />
          </div>
        )}

        {/* Recent Books */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: isMobile ? "16px" : "20px", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#f0ece4" }}>Recent Books</div>
            {!loading && books.length > 0 && (
              <span style={{ fontSize: "12px", color: "#5a5f78" }}>{books.length} shown</span>
            )}
          </div>

          {isMobile ? (
            loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: "58px", borderRadius: "10px" }} />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center", color: "#5a5f78", fontSize: "13px" }}>No books yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {books.slice(0, 5).map((book: any) => (
                  <div key={book._id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                    padding: "10px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ color: "#f0ece4", fontSize: "14px", fontWeight: 500, fontStyle: "italic", fontFamily: "serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</div>
                      <div style={{ color: "#8a8fa8", fontSize: "12px", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {book.author?.name || book.author || "—"}
                      </div>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, background: book.isBorrowed ? "rgba(90,141,238,0.12)" : "rgba(76,175,130,0.12)", color: book.isBorrowed ? "#5a8dee" : "#4caf82", letterSpacing: "0.5px", textTransform: "uppercase", flexShrink: 0 }}>
                      {book.isBorrowed ? "Out" : "In"}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
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
          )}
        </div>

        {/* Overdue */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: isMobile ? "16px" : "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#f0ece4" }}>Overdue Books</div>
            {!loading && (
              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: overdue.length > 0 ? "rgba(224,85,85,0.12)" : "rgba(76,175,130,0.12)", color: overdue.length > 0 ? "#e05555" : "#4caf82" }}>
                {overdue.length} overdue
              </span>
            )}
          </div>

          {isMobile ? (
            loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: "58px", borderRadius: "10px" }} />
                ))}
              </div>
            ) : overdue.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center", color: "#5a5f78", fontSize: "13px" }}>All clear — no overdue books.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {overdue.slice(0, 5).map((book: any) => (
                  <div key={book._id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                    padding: "10px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ color: "#f0ece4", fontSize: "14px", fontWeight: 500, fontStyle: "italic", fontFamily: "serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</div>
                      <div style={{ color: "#8a8fa8", fontSize: "12px", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {book.borrowedBy?.name || "—"}
                      </div>
                    </div>
                    <span style={{ color: "#e05555", fontSize: "11px", fontWeight: 600, flexShrink: 0 }}>
                      {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
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
          )}
        </div>

      </div>
    </div>
  );
}
