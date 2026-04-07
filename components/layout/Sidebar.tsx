// // "use client";

// // import { usePathname, useRouter } from "next/navigation";
// // import Link from "next/link";

// // const navItems = [
// //   {
// //     section: "Overview",
// //     links: [
// //       { href: "/", label: "Dashboard", icon: (
// //         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
// //       )},
// //     ],
// //   },
// //   {
// //     section: "Library",
// //     links: [
// //       { href: "/books", label: "Books", icon: (
// //         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
// //       )},
// //       { href: "/authors", label: "Authors", icon: (
// //         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
// //       )},
// //     ],
// //   },
// //   {
// //     section: "People",
// //     links: [
// //       { href: "/students", label: "Students", icon: (
// //         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
// //       )},
// //       { href: "/attendants", label: "Attendants", icon: (
// //         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>
// //       )},
// //     ],
// //   },
// //   {
// //     section: "Activity",
// //     links: [
// //       { href: "/borrow", label: "Borrow / Return", icon: (
// //         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
// //       )},
// //     ],
// //   },
// // ];

// // export default function Sidebar() {
// //   const pathname = usePathname();
// //   const router = useRouter();

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     router.push("/login");
// //   };

// //   return (
// //     <aside style={{
// //       width: "220px", background: "#14171f", borderRight: "1px solid rgba(255,255,255,0.07)",
// //       display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
// //     }}>
// //       {/* Logo */}
// //       <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
// //         <div style={{ fontFamily: "serif", fontSize: "20px", color: "#c8a96e" }}>LibraryOS</div>
// //         <div style={{ fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "2px", marginTop: "2px" }}>Management System</div>
// //       </div>

// //       {/* Nav */}
// //       <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
// //         {navItems.map((group) => (
// //           <div key={group.section}>
// //             <div style={{ padding: "0 12px 8px", fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "12px" }}>
// //               {group.section}
// //             </div>
// //             {group.links.map((link) => {
// //               const active = pathname === link.href;
// //               return (
// //                 <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
// //                   <div style={{
// //                     display: "flex", alignItems: "center", gap: "10px",
// //                     padding: "9px 16px", margin: "2px 8px", borderRadius: "8px",
// //                     fontSize: "14px", cursor: "pointer", position: "relative",
// //                     color: active ? "#c8a96e" : "#8a8fa8",
// //                     background: active ? "rgba(200,169,110,0.12)" : "transparent",
// //                     transition: "all 0.15s",
// //                   }}>
// //                     {active && (
// //                       <div style={{
// //                         position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)",
// //                         width: "3px", height: "20px", background: "#c8a96e", borderRadius: "0 3px 3px 0",
// //                       }} />
// //                     )}
// //                     {link.icon}
// //                     {link.label}
// //                   </div>
// //                 </Link>
// //               );
// //             })}
// //           </div>
// //         ))}
// //       </nav>

// //       {/* Footer */}
// //       <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
// //         <div style={{
// //           display: "flex", alignItems: "center", gap: "10px",
// //           padding: "10px 12px", background: "#1c202c", borderRadius: "10px",
// //         }}>
// //           <div style={{
// //             width: "32px", height: "32px", borderRadius: "50%",
// //             background: "linear-gradient(135deg, #c8a96e, #9b7a4a)",
// //             display: "flex", alignItems: "center", justifyContent: "center",
// //             fontSize: "13px", fontWeight: 600, color: "#0f1117", flexShrink: 0,
// //           }}>CP</div>
// //           <div style={{ flex: 1 }}>
// //             <div style={{ fontSize: "13px", fontWeight: 500, color: "#f0ece4" }}>Chiamaka P.</div>
// //             <div style={{ fontSize: "11px", color: "#5a5f78" }}>Librarian</div>
// //           </div>
// //           <button onClick={handleLogout} title="Logout" style={{
// //             background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "16px",
// //           }}>⏻</button>
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }

// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";

// const navItems = [
//   {
//     section: "Overview",
//     links: [
//       { href: "/", label: "Dashboard", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>) },
//     ],
//   },
//   {
//     section: "Library",
//     links: [
//       { href: "/books", label: "Books", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>) },
//       { href: "/authors", label: "Authors", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>) },
//     ],
//   },
//   {
//     section: "People",
//     links: [
//       { href: "/students", label: "Students", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>) },
//       { href: "/attendants", label: "Attendants", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>) },
//     ],
//   },
//   {
//     section: "Activity",
//     links: [
//       { href: "/borrow", label: "Borrow / Return", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>) },
//     ],
//   },
// ];

// export default function Sidebar({ onClose }: { onClose?: () => void }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   return (
//     <aside style={{
//       width: "220px", background: "#14171f",
//       borderRight: "1px solid rgba(255,255,255,0.07)",
//       display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
//     }}>
//       {/* Logo */}
//       <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div>
//           <div style={{ fontFamily: "serif", fontSize: "20px", color: "#c8a96e" }}>LibraryOS</div>
//           <div style={{ fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "2px", marginTop: "2px" }}>Management System</div>
//         </div>
//         {onClose && (
//           <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px", padding: "4px" }}>✕</button>
//         )}
//       </div>

//       {/* Nav */}
//       <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
//         {navItems.map((group) => (
//           <div key={group.section}>
//             <div style={{ padding: "0 12px 8px", fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "12px" }}>
//               {group.section}
//             </div>
//             {group.links.map((link) => {
//               const active = pathname === link.href;
//               return (
//                 <Link key={link.href} href={link.href} style={{ textDecoration: "none" }} onClick={onClose}>
//                   <div style={{
//                     display: "flex", alignItems: "center", gap: "10px",
//                     padding: "9px 16px", margin: "2px 8px", borderRadius: "8px",
//                     fontSize: "14px", cursor: "pointer", position: "relative",
//                     color: active ? "#c8a96e" : "#8a8fa8",
//                     background: active ? "rgba(200,169,110,0.12)" : "transparent",
//                   }}>
//                     {active && (
//                       <div style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", width: "3px", height: "20px", background: "#c8a96e", borderRadius: "0 3px 3px 0" }} />
//                     )}
//                     {link.icon}
//                     {link.label}
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#1c202c", borderRadius: "10px" }}>
//           <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #c8a96e, #9b7a4a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "#0f1117", flexShrink: 0 }}>CP</div>
//           <div style={{ flex: 1, minWidth: 0 }}>
//             <div style={{ fontSize: "13px", fontWeight: 500, color: "#f0ece4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Chiamaka P.</div>
//             <div style={{ fontSize: "11px", color: "#5a5f78" }}>Librarian</div>
//           </div>
//           <button onClick={handleLogout} title="Logout" style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}>⏻</button>
//         </div>
//       </div>
//     </aside>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    section: "Overview",
    links: [
      { href: "/", label: "Dashboard", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>) },
    ],
  },
  {
    section: "Library",
    links: [
      { href: "/books", label: "Books", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>) },
      { href: "/authors", label: "Authors", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>) },
    ],
  },
  {
    section: "People",
    links: [
      { href: "/students", label: "Students", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>) },
      { href: "/attendants", label: "Attendants", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>) },
    ],
  },
  {
    section: "Activity",
    links: [
      { href: "/borrow", label: "Borrow / Return", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>) },
    ],
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside style={{
      width: "220px", background: "#14171f",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "serif", fontSize: "20px", color: "#c8a96e" }}>LibraryOS</div>
          <div style={{ fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "2px", marginTop: "2px" }}>Management System</div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px", padding: "4px" }}>✕</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {navItems.map((group) => (
          <div key={group.section}>
            <div style={{ padding: "0 12px 8px", fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "12px" }}>
              {group.section}
            </div>
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }} onClick={onClose}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 16px", margin: "2px 8px", borderRadius: "8px",
                    fontSize: "14px", cursor: "pointer", position: "relative",
                    color: active ? "#c8a96e" : "#8a8fa8",
                    background: active ? "rgba(200,169,110,0.12)" : "transparent",
                  }}>
                    {active && (
                      <div style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", width: "3px", height: "20px", background: "#c8a96e", borderRadius: "0 3px 3px 0" }} />
                    )}
                    {link.icon}
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#1c202c", borderRadius: "10px" }}>
          
          {/* Avatar */}
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c8a96e, #9b7a4a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 600,
            color: "#0f1117",
            flexShrink: 0
          }}>
            {user?.name
              ?.split(" ")
              .map((w: string) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "LB"}
          </div>

          {/* User Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#f0ece4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "Librarian"}
            </div>
            <div style={{ fontSize: "11px", color: "#5a5f78" }}>
              {user?.email || "Library Staff"}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}