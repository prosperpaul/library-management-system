"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/layout/Topbar";
import { api } from "@/lib/api";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", nationality: "", bio: "" });

  const fetchAuthors = async () => {
    setLoading(true);
    const data = await api.get("/authors");
    setAuthors(data.authors || data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleAdd = async () => {
    await api.post("/authors", form);
    setShowModal(false);
    setForm({ name: "", nationality: "", bio: "" });
    fetchAuthors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this author?")) return;
    await api.delete(`/authors/${id}`);
    fetchAuthors();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Topbar title="Authors" onAdd={() => setShowModal(true)} />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
        <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          {loading ? (
            <div style={{ color: "#5a5f78", padding: "40px", textAlign: "center" }}>Loading authors...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Name", "Nationality", "Bio", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {authors.map((author: any) => (
                  <tr key={author._id}>
                    <td style={{ padding: "12px", color: "#f0ece4", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{author.name}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{author.nationality || "—"}</td>
                    <td style={{ padding: "12px", color: "#8a8fa8", borderBottom: "1px solid rgba(255,255,255,0.04)", maxWidth: "300px" }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{author.bio || "—"}</span>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <button onClick={() => handleDelete(author._id)} style={{ background: "none", border: "1px solid rgba(224,85,85,0.3)", color: "#e05555", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: "#14171f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", width: "440px" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "18px", color: "#f0ece4" }}>Add New Author</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#5a5f78", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {[
                { label: "Full Name", key: "name", placeholder: "e.g. Chinua Achebe" },
                { label: "Nationality", key: "nationality", placeholder: "e.g. Nigerian" },
                { label: "Bio", key: "bio", placeholder: "Short biography..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", color: "#5a5f78", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</label>
                  <input placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "10px 12px", color: "#f0ece4", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "#1c202c", border: "1px solid rgba(255,255,255,0.07)", color: "#8a8fa8", padding: "8px 16px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>Cancel</button>
              <button onClick={handleAdd} style={{ background: "#c8a96e", color: "#0f1117", padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: 600 }}>Save →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}