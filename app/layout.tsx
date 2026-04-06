import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "LibraryOS",
  description: "School Library Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{
        margin: 0,
        background: "#0f1117",
        color: "#f0ece4",
        fontFamily: "DM Sans, sans-serif",
      }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}