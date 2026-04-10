"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    section: "Overview",
    links: [
      {
        href: "/", label: "Dashboard",
        icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
      },
    ],
  },
  {
    section: "Library",
    links: [
      {
        href: "/books", label: "Books",
        icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
      },
      {
        href: "/authors", label: "Authors",
        icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
      },
    ],
  },
  {
    section: "People",
    links: [
      {
        href: "/students", label: "Students",
        icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      },
      {
        href: "/attendants", label: "Attendants",
        icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>,
      },
    ],
  },
  {
    section: "Activity",
    links: [
      {
        href: "/borrow", label: "Borrow / Return",
        icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
      },
    ],
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "LB";

  return (
    <aside style={{
      width: "220px",
      background: "#14171f",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      flexShrink: 0,
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: "22px 20px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontFamily: "serif", fontSize: "20px", color: "#c8a96e", letterSpacing: "0.3px" }}>
            LibraryOS
          </div>
          <div style={{ fontSize: "10px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "2px", marginTop: "3px" }}>
            Management System
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "18px", padding: "2px", marginTop: "2px" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {navItems.map((group) => (
          <div key={group.section} style={{ marginBottom: "4px" }}>
            <div style={{
              padding: "10px 16px 5px",
              fontSize: "10px", color: "#5a5f78",
              textTransform: "uppercase", letterSpacing: "1.5px",
              fontWeight: 600,
            }}>
              {group.section}
            </div>
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: "none", display: "block" }}
                  onClick={onClose}
                >
                  <div
                    className="nav-link"
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "9px 14px", margin: "1px 8px", borderRadius: "9px",
                      fontSize: "13.5px", fontWeight: active ? 500 : 400,
                      position: "relative",
                      color: active ? "#c8a96e" : "#8a8fa8",
                      background: active ? "rgba(200,169,110,0.1)" : "transparent",
                    }}
                  >
                    {active && (
                      <div style={{
                        position: "absolute", left: 0, top: "50%",
                        transform: "translateY(-50%)",
                        width: "3px", height: "18px",
                        background: "#c8a96e", borderRadius: "0 3px 3px 0",
                      }} />
                    )}
                    <span style={{ opacity: active ? 1 : 0.7 }}>{link.icon}</span>
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div style={{ padding: "12px 14px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Role badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "3px 10px", borderRadius: "20px", fontSize: "10px",
          fontWeight: 600, letterSpacing: "0.5px", marginBottom: "10px",
          background: user?.role === "admin" ? "rgba(200,169,110,0.1)" : "rgba(90,141,238,0.1)",
          border: `1px solid ${user?.role === "admin" ? "rgba(200,169,110,0.2)" : "rgba(90,141,238,0.2)"}`,
          color: user?.role === "admin" ? "#c8a96e" : "#5a8dee",
          textTransform: "uppercase",
        }}>
          {user?.role === "admin" ? (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/>
            </svg>
          )}
          {user?.role === "admin" ? "Admin" : "Attendant"}
        </div>

        {/* User card */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px",
          background: "#1c202c",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "11px",
        }}>
          {/* Avatar */}
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #c8a96e, #9b7a4a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 700, color: "#0f1117", flexShrink: 0,
          }}>
            {initials}
          </div>

          {/* Name + email */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "13px", fontWeight: 500, color: "#f0ece4",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.name || "Librarian"}
            </div>
            <div style={{
              fontSize: "11px", color: "#5a5f78",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.email || ""}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => router.push("/logout")}
            title="Sign out"
            style={{
              background: "none",
              border: "1px solid rgba(224,85,85,0.2)",
              color: "#5a5f78",
              cursor: "pointer",
              padding: "5px",
              borderRadius: "7px",
              flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(224,85,85,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "#e05555";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(224,85,85,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(224,85,85,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "#5a5f78";
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
