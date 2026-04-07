interface FormFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export default function FormField({
  label, value, onChange, placeholder = "", type = "text", required = false,
}: FormFieldProps) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "11px", color: "#5a5f78",
        textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px",
      }}>
        {label}{required && <span style={{ color: "#e05555", marginLeft: "3px" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", background: "#1c202c",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "8px", padding: "10px 12px",
          color: "#f0ece4", fontSize: "14px",
          outline: "none", fontFamily: "inherit",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => e.target.style.borderColor = "rgba(200,169,110,0.5)"}
        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
      />
    </div>
  );
}