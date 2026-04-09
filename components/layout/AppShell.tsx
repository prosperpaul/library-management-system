"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import MenuButton from "@/components/ui/MenuButton";
import { useAuth } from "@/context/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f1117" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "serif", fontSize: "24px", color: "#c8a96e", marginBottom: "16px" }}>LibraryOS</div>
          <div style={{ width: "24px", height: "24px", border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#c8a96e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (isAuthPage) return <>{children}</>;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>

      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(2px)" }} />
      )}

      <div style={{
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? "0" : "-220px") : "0",
        top: 0, bottom: 0, zIndex: 50,
        transition: "left 0.25s ease",
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {isMobile && (
          <div style={{ padding: "0 16px", height: "56px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0f1117", flexShrink: 0 }}>
            <MenuButton open={sidebarOpen} onClick={() => setSidebarOpen(o => !o)} />
            <span style={{ fontFamily: "serif", fontSize: "18px", color: "#c8a96e" }}>LibraryOS</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
