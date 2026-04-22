"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { useAuth } from "@/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/logout";

  useEffect(() => {
    if (!loading && !token && !isAuthPage) {
      router.push("/login");
    }
  }, [token, loading, isAuthPage, router]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close drawer on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const splash = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f1117" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "serif", fontSize: "24px", color: "#c8a96e", marginBottom: "16px" }}>LibraryOS</div>
        <div style={{ width: "24px", height: "24px", border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#c8a96e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (loading) return splash;

  if (isAuthPage) return <>{children}</>;

  // Not authenticated on a protected page — render splash while redirect is in flight
  if (!token) return splash;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Backdrop (mobile drawer) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar — persistent on desktop, drawer on mobile */}
      <div style={{
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? "0" : "-240px") : "0",
        top: 0, bottom: 0, zIndex: 50,
        transition: "left 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        overflow: "hidden", minWidth: 0,
        paddingBottom: isMobile ? "94px" : 0,
      }}>
        {children}
      </main>

      {/* Mobile floating bottom nav */}
      {isMobile && (
        <MobileBottomNav
          drawerOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />
      )}
    </div>
  );
}
