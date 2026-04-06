// "use client";

// import { useEffect, useState } from "react";
// import Topbar from "@/components/layout/Topbar";
// import { api } from "@/lib/api";

// interface StatsCardProps {
//   label: string;
//   value: number | string;
//   sub: string;
//   dotColor: string;
// }

// function StatCard({ label, value, sub, dotColor }: StatsCardProps) {
//   return (
//     <div style={{
//       background: "#14171f", border: "1px solid rgba(255,255,255,0.07)",
//       borderRadius: "14px", padding: "20px",
//     }}>
//       <div style={{ fontSize: "12px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{label}</div>
//       <div style={{ fontFamily: "serif", fontSize: "32px", color: "#f0ece4" }}>{value}</div>
//       <div style={{ fontSize: "12px", color: "#8a8fa8", marginTop: "6px" }}>
//         <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: dotColor, marginRight: "5px", verticalAlign: "middle" }} />
//         {sub}
//       </div>
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const [books, setBooks] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [overdue, setOverdue] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       api.get("/books?limit=5"),
//       api.get("/students"),
//       api.get("/books/overdue"),
//     ]).then(([booksData, studentsData, overdueData]) => {
//       setBooks(booksData.books || booksData || []);
//       setStudents(studentsData.students || studentsData || []);
//       setOverdue(overdueData || []);
//     }).finally(() => setLoading(false));
//   }, []);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
//       <Topbar title="Dashboard" />
//       <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>

//         {/* Stats */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
//           <StatCard label="Total Books" value={books.length || "—"} sub="In the library" dotColor="#4caf82" />
//           <StatCard label="Students" value={students.length || "—"} sub="Registered" dotColor="#5a8dee" />
//           <StatCard label="Overdue" value={overdue.length || 0} sub="Needs follow-up" dotColor="#e05555" />
//           <StatCard label="Available" value="—" sub="Ready to borrow" dotColor="#c8a96e" />
//         </div>

//         {/* Recent Books Table */}
//         <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
//           <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0ece4", marginBottom: "16px" }}>Recent Books</div>
//           {loading ? (
//             <div style={{ color: "#5a5f78", fontSize: "14px", padding: "20px 0" }}>Loading...</div>
//           ) : (
//             <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
//               <thead>
//                 <tr>
//                   {["Title", "Author", "ISBN", "Status"].map(h => (
//                     <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {books.slice(0, 5).map((book: any) => (
//                   <tr key={book._id}>
//                     <td style={{ padding: "12px", color: "#f0ece4", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.title}</td>
//                     <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.author?.name || book.author || "—"}</td>
//                     <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.isbn || "—"}</td>
//                     <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
//                       <span style={{
//                         padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 500,
//                         background: book.isBorrowed ? "rgba(90,141,238,0.15)" : "rgba(76,175,130,0.15)",
//                         color: book.isBorrowed ? "#5a8dee" : "#4caf82",
//                       }}>
//                         {book.isBorrowed ? "Borrowed" : "Available"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Overdue */}
//         <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
//           <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0ece4", marginBottom: "16px" }}>Overdue Books</div>
//           {overdue.length === 0 ? (
//             <div style={{ color: "#5a5f78", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>No overdue books 🎉</div>
//           ) : (
//             overdue.slice(0, 5).map((book: any) => (
//               <div key={book._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
//                 <div>
//                   <div style={{ fontSize: "13px", fontWeight: 500, color: "#f0ece4" }}>{book.title}</div>
//                   <div style={{ fontSize: "12px", color: "#5a5f78" }}>{book.borrowedBy?.name || "Unknown student"}</div>
//                 </div>
//                 <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "11px", background: "rgba(224,85,85,0.15)", color: "#e05555" }}>Overdue</span>
//               </div>
//             ))
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";

function StatCard({ label, value, sub, dotColor }: { label: string; value: number | string; sub: string; dotColor: string }) {
  return (
    <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
      <div style={{ fontSize: "12px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{label}</div>
      <div style={{ fontFamily: "serif", fontSize: "32px", color: "#f0ece4" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#8a8fa8", marginTop: "6px" }}>
        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: dotColor, marginRight: "5px", verticalAlign: "middle" }} />
        {sub}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/books?limit=5"),
      api.get("/students"),
      api.get("/books/overdue"),
    ]).then(([booksData, studentsData, overdueData]) => {
      setBooks(booksData.books || booksData || []);
      setStudents(studentsData.students || studentsData || []);
      setOverdue(overdueData || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Topbar title="Dashboard" />
      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 28px)" }}>

        {/* Responsive stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px", marginBottom: "24px",
        }}>
          <StatCard label="Total Books" value={books.length || "—"} sub="In the library" dotColor="#4caf82" />
          <StatCard label="Students" value={students.length || "—"} sub="Registered" dotColor="#5a8dee" />
          <StatCard label="Overdue" value={overdue.length || 0} sub="Needs follow-up" dotColor="#e05555" />
          <StatCard label="Available" value={books.filter((b: any) => !b.isBorrowed).length || "—"} sub="Ready to borrow" dotColor="#c8a96e" />
        </div>

        {/* Recent Books */}
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0ece4", marginBottom: "16px" }}>Recent Books</div>
          {loading ? (
            <div style={{ color: "#5a5f78", fontSize: "14px", padding: "20px 0" }}>Loading...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "500px" }}>
                <thead>
                  <tr>
                    {["Title", "Author", "ISBN", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.slice(0, 5).map((book: any) => (
                    <tr key={book._id}>
                      <td style={{ padding: "12px", color: "#f0ece4", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.title}</td>
                      <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.author?.name || book.author || "—"}</td>
                      <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.isbn || "—"}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 500, background: book.isBorrowed ? "rgba(90,141,238,0.15)" : "rgba(76,175,130,0.15)", color: book.isBorrowed ? "#5a8dee" : "#4caf82" }}>
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
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#f0ece4", marginBottom: "16px" }}>Overdue Books</div>
          {overdue.length === 0 ? (
            <div style={{ color: "#5a5f78", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>No overdue books 🎉</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "400px" }}>
                <thead>
                  <tr>
                    {["Book", "Student", "Status"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {overdue.slice(0, 5).map((book: any) => (
                    <tr key={book._id}>
                      <td style={{ padding: "12px", color: "#f0ece4", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.title}</td>
                      <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{book.borrowedBy?.name || "—"}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ padding: "3px 9px", borderRadius: "20px", fontSize: "11px", background: "rgba(224,85,85,0.15)", color: "#e05555" }}>Overdue</span>
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