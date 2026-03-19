export function PlaceholderPage({ title, icon, description }) {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 800,
          color: "#F8FAFC",
          margin: "0 0 32px",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h1>

      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14,
          padding: "48px 28px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "rgba(248,250,252,0.6)",
            margin: "0 0 8px",
          }}
        >
          Em breve
        </h3>
        <p style={{ fontSize: 14, color: "rgba(248,250,252,0.35)", maxWidth: 400, margin: "0 auto" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function EmpresasPage() {
  return (
    <PlaceholderPage
      title="Empresas"
      icon="🏢"
      description="Aqui você vai cadastrar e gerenciar os CNPJs da sua carteira."
    />
  );
}

export function DividasPage() {
  return (
    <PlaceholderPage
      title="Dívidas"
      icon="📋"
      description="Aqui você vai visualizar e gerenciar as dívidas tributárias das suas empresas."
    />
  );
}

export function ProgramasPage() {
  return (
    <PlaceholderPage
      title="Programas"
      icon="📡"
      description="Aqui você vai acompanhar os programas de regularização fiscal disponíveis."
    />
  );
}

export function MatchesPage() {
  return (
    <PlaceholderPage
      title="Matches"
      icon="⚡"
      description="Aqui você vai ver os cruzamentos entre dívidas e programas de regularização."
    />
  );
}

export function EquipePage() {
  return (
    <PlaceholderPage
      title="Equipe"
      icon="👥"
      description="Aqui você vai convidar membros da equipe e gerenciar permissões."
    />
  );
}
