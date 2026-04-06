// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// interface TopbarProps {
//   title: string;
//   onAdd?: () => void;
//   addLabel?: string;
// }

// export default function Topbar({ title, onAdd, addLabel = "+ Add New" }: TopbarProps) {
//   const [query, setQuery] = useState("");
//   const router = useRouter();

//   return (
//     <div style={{
//       padding: "0 28px", height: "64px", display: "flex", alignItems: "center",
//       justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)",
//       background: "#0f1117", flexShrink: 0,
//     }}>
//       <h1 style={{ fontFamily: "serif", fontSize: "22px", color: "#f0ece4" }}>{title}</h1>
//       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//         <div style={{
//           display: "flex", alignItems: "center", gap: "8px",
//           background: "#14171f", border: "1px solid rgba(255,255,255,0.07)",
//           borderRadius: "10px", padding: "8px 14px", width: "220px",
//         }}>
//           <svg width="14" height="14" fill="none" stroke="#5a5f78" strokeWidth="2" viewBox="0 0 24 24">
//             <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//           </svg>
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search..."
//             style={{ background: "none", border: "none", outline: "none", fontSize: "13px", color: "#f0ece4", width: "100%", fontFamily: "inherit" }}
//           />
//         </div>
//         {onAdd && (
//           <button onClick={onAdd} style={{
//             display: "inline-flex", alignItems: "center", gap: "6px",
//             padding: "8px 16px", borderRadius: "9px", fontSize: "13px", fontWeight: 500,
//             background: "#c8a96e", color: "#0f1117", border: "none", cursor: "pointer", fontFamily: "inherit",
//           }}>
//             {addLabel}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

interface TopbarProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}

export default function Topbar({ title, onAdd, addLabel = "+ Add New" }: TopbarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{
      padding: isMobile ? "0 16px" : "0 28px",
      height: "64px", display: "flex", alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      background: "#0f1117", flexShrink: 0,
    }}>
      <h1 style={{ fontFamily: "serif", fontSize: isMobile ? "18px" : "22px", color: "#f0ece4" }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Search — hidden on mobile */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "8px 14px", width: "220px" }}>
            <svg width="14" height="14" fill="none" stroke="#5a5f78" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search..." style={{ background: "none", border: "none", outline: "none", fontSize: "13px", color: "#f0ece4", width: "100%", fontFamily: "inherit" }} />
          </div>
        )}

        {onAdd && (
          <button onClick={onAdd} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: isMobile ? "7px 12px" : "8px 16px",
            borderRadius: "9px", fontSize: isMobile ? "12px" : "13px",
            fontWeight: 500, background: "#c8a96e", color: "#0f1117",
            border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
          }}>
            {isMobile ? "+" : addLabel}
          </button>
        )}
      </div>
    </div>
  );
}