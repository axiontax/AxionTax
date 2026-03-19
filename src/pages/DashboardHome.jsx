import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from "../supabase.js";

export default function DashboardHome() {
  const { profile, org } = useAuth();
  const [stats, setStats] = useState({ companies: 0, debts: 0, matches: 0, economia: 0 });

  useEffect(() => {
    if (!org) return;
    loadStats();
  }, [org]);

  async function loadStats() {
    try {
      const { count: companies } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id);

      const { data: debtsData } = await supabase
        .from("debts")
        .select("id, valor_original, company_id, companies!inner(org_id)")
        .eq("companies.org_id", org.id);

      const { data: matchesData } = await supabase
        .from("matches")
        .select("id, economia_estimada, debts!inner(company_id, companies!inner(org_id))")
        .eq("debts.companies.org_id", org.id);

      setStats({
        companies: companies || 0,
        debts: debtsData?.length || 0,
        matches: matchesData?.length || 0,
        economia: matchesData?.reduce((sum, m) => sum + (m.economia_estimada || 0), 0) || 0,
      });
    } catch (e) {
      console.error(e);
    }
  }

  const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cards = [
    { label: "Empresas", value: stats.companies, icon: "🏢", color: "#3B82F6" },
    { label: "Dívidas", value: stats.debts, icon: "📋", color: "#EF4444" },
    { label: "Matches", value: stats.matches, icon: "⚡", color: "#10B981" },
    { label: "Economia Total", value: fmt(stats.economia), icon: "💰", color: "#8B5CF6" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 800,
            color: "#F8FAFC",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Olá, {profile?.full_name?.split(" ")[0] || ""}
        </h1>
        <p style={{ fontSize: 14, color: "rgba(248,250,252,0.4)", marginTop: 6 }}>
          Aqui está o resumo do seu escritório
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "24px 20px",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.45)" }}>{c.label}</span>
              <span style={{ fontSize: 20 }}>{c.icon}</span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: typeof c.value === "number" ? 32 : 24,
                fontWeight: 800,
                color: c.color,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {stats.companies === 0 && (
        <div
          style={{
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.12)",
            borderRadius: 14,
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "#F8FAFC",
              margin: "0 0 8px",
            }}
          >
            Comece cadastrando suas empresas
          </h3>
          <p style={{ fontSize: 14, color: "rgba(248,250,252,0.4)", maxWidth: 400, margin: "0 auto 20px" }}>
            Adicione os CNPJs da sua carteira para começar a monitorar programas de regularização fiscal.
          </p>
          <span style={{ fontSize: 13, color: "rgba(248,250,252,0.35)" }}>
            Vá em <strong style={{ color: "#3B82F6" }}>Empresas</strong> no menu lateral para começar.
          </span>
        </div>
      )}
    </div>
  );
}
