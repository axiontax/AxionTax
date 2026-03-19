import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { createOrg } = useAuth();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!orgName.trim()) {
      setError("Digite o nome do escritório.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createOrg(orgName.trim());
      navigate("/app");
    } catch (e) {
      setError(e.message || "Erro ao criar escritório.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: 46,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "0 16px",
    fontSize: 14,
    color: "#F8FAFC",
    outline: "none",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0A0C14 0%, #0F1724 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: "40px 36px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                color: "#F8FAFC",
                margin: 0,
              }}
            >
              Configure seu escritório
            </h1>
            <p style={{ fontSize: 14, color: "rgba(248,250,252,0.4)", marginTop: 8 }}>
              Crie a organização onde sua equipe vai trabalhar
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#FCA5A5",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)", marginBottom: 6 }}>
              Nome do escritório
            </label>
            <input
              type="text"
              placeholder="Ex: Contabilidade Silva & Associados"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              width: "100%",
              height: 46,
              background: "#3B82F6",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              fontFamily: "var(--font-body)",
              marginTop: 20,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Criando..." : "Criar escritório"}
          </button>
        </div>
      </div>
    </div>
  );
}
