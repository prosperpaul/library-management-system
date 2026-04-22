"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
  onMenuClick: () => void;
  drawerOpen: boolean;
}

export default function MobileBottomNav({ onMenuClick, drawerOpen }: MobileBottomNavProps) {
  const pathname = usePathname();

  const items = [
    {
      href: "/", label: "Dashboard",
      icon: (active: boolean) => (
        <svg width="20" height="20" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      ),
    },
    {
      href: "/books", label: "Books",
      icon: (active: boolean) => (
        <svg width="20" height="20" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      ),
    },
    {
      href: "/borrow", label: "Borrow",
      icon: () => (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <polyline points="17 1 21 5 17 9"/>
          <path d="M3 11V9a4 4 0 014-4h14"/>
          <polyline points="7 23 3 19 7 15"/>
          <path d="M21 13v2a4 4 0 01-4 4H3"/>
        </svg>
      ),
    },
  ];

  return (
    <nav style={{
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(92%, 420px)",
      height: "62px",
      borderRadius: "999px",
      background: "color-mix(in srgb, var(--surface) 88%, transparent)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1px solid var(--border-hover)",
      boxShadow: "var(--shadow-lg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 14px",
      zIndex: 45,
    }}>
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: "none", flex: 1 }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "3px",
              color: active ? "#c8a96e" : "var(--text-dim)",
              transform: active ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
            }}>
              {item.icon(active)}
              <span style={{
                fontFamily: "serif",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                fontWeight: active ? 600 : 400,
              }}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}

      {/* Menu trigger (morphs to X when drawer open) */}
      <button
        onClick={onMenuClick}
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
        style={{
          flex: 1, background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
          color: drawerOpen ? "#c8a96e" : "var(--text-dim)",
          transform: drawerOpen ? "scale(1.05)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div style={{
          width: "22px", height: "16px", position: "relative",
          display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start",
        }}>
          <span style={{
            height: "2px", borderRadius: "2px", background: "currentColor",
            width: drawerOpen ? "22px" : "22px",
            transform: drawerOpen ? "translateY(6px) rotate(45deg)" : "none",
            transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          }} />
          <span style={{
            height: "2px", borderRadius: "2px", background: "currentColor",
            width: drawerOpen ? "0" : "14px",
            opacity: drawerOpen ? 0 : 1,
            transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          }} />
          <span style={{
            height: "2px", borderRadius: "2px", background: "currentColor",
            width: drawerOpen ? "22px" : "18px",
            transform: drawerOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            transition: "all 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
          }} />
        </div>
        <span style={{
          fontFamily: "serif",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          fontWeight: drawerOpen ? 600 : 400,
        }}>
          {drawerOpen ? "Close" : "Menu"}
        </span>
      </button>
    </nav>
  );
}
