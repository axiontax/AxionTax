import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!isLogin && !name) {
      setError("Preencha seu nome.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/app");
      } else {
        await signUp(email, password, name);
        setSuccess("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (e) {
      const msg = e.message || "Erro inesperado.";
      if (msg.includes("Invalid login")) setError("E-mail ou senha incorretos.");
      else if (msg.includes("already registered")) setError("Este e-mail já está cadastrado.");
      else if (msg.includes("Password should be")) setError("A senha deve ter pelo menos 6 caracteres.");
      else setError(msg);
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
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 40,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "linear-gradient(135deg, #3B82F6, #10B981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 15,
              color: "#fff",
            }}
          >
            Ax
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "#F8FAFC" }}>
            Axion<span style={{ color: "#3B82F6" }}>Tax</span>
          </span>
        </Link>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: "40px 36px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -1,
              left: 36,
              right: 36,
              height: 2,
              background: "linear-gradient(90deg, transparent, #3B82F6, #10B981, transparent)",
              borderRadius: 2,
            }}
          />

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                color: "#F8FAFC",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(248,250,252,0.4)", marginTop: 8, margin: "8px 0 0" }}>
              {isLogin ? "Acesse sua conta para continuar" : "Comece gratuitamente por 14 dias"}
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

          {success && (
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#A5F3C0",
                marginBottom: 16,
              }}
            >
              {success}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!isLogin && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)", marginBottom: 6 }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)", marginBottom: 6 }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)", marginBottom: 6 }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                height: 46,
                background: loading ? "#2563EB" : "#3B82F6",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "wait" : "pointer",
                transition: "all 0.25s",
                fontFamily: "var(--font-body)",
                marginTop: 4,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "rgba(248,250,252,0.4)" }}>
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#3B82F6",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "var(--font-body)",
              }}
            >
              {isLogin ? "Registre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
