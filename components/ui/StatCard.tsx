interface StatCardProps {
  label: string;
  value: number | string;
  sub: string;
  dotColor: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, sub, dotColor, icon }: StatCardProps) {
  return (
    <div style={{
      background: "#14171f",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow dot */}
      <div style={{
        position: "absolute", top: "16px", right: "16px",
        width: "36px", height: "36px", borderRadius: "50%",
        background: dotColor, opacity: 0.12,
      }} />

      <div style={{ fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1.2px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "serif", fontSize: "34px", color: "#f0ece4", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "12px", color: "#8a8fa8", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
        {sub}
      </div>
    </div>
  );
}