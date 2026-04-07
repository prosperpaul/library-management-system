type BadgeVariant = "green" | "red" | "blue" | "amber" | "purple";

const variants: Record<BadgeVariant, { bg: string; color: string }> = {
  green:  { bg: "rgba(76,175,130,0.15)",  color: "#4caf82" },
  red:    { bg: "rgba(224,85,85,0.15)",   color: "#e05555" },
  blue:   { bg: "rgba(90,141,238,0.15)",  color: "#5a8dee" },
  amber:  { bg: "rgba(200,169,110,0.15)", color: "#c8a96e" },
  purple: { bg: "rgba(155,89,182,0.15)",  color: "#9b59b6" },
};

export default function Badge({ label, variant = "blue" }: { label: string; variant?: BadgeVariant }) {
  const { bg, color } = variants[variant];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "11px", fontWeight: 500,
      background: bg, color,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}