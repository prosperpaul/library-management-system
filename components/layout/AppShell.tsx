// "use client";

// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Sidebar from "./Sidebar";

// export default function AppShell({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token && pathname !== "/login") {
//       router.push("/login");
//     }
//   }, [pathname, router]);

//   if (pathname === "/login") return <>{children}</>;

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       <Sidebar />
//       <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//         {children}
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
      router.push("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  if (isAuthPage) return <>{children}</>;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? "0" : "-220px") : "0",
        top: 0, bottom: 0, zIndex: 50,
        transition: "left 0.25s ease",
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Mobile topbar hamburger */}
        {isMobile && (
          <div style={{
            padding: "0 16px", height: "56px", display: "flex", alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0f1117", flexShrink: 0,
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", color: "#f0ece4", cursor: "pointer", fontSize: "22px", padding: "4px" }}
            >
              ☰
            </button>
            <span style={{ fontFamily: "serif", fontSize: "18px", color: "#c8a96e", marginLeft: "12px" }}>LibraryOS</span>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}