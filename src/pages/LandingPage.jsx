import { useState, useEffect, useRef } from "react";

/* ─────────────────────── helpers ─────────────────────── */
const fmt = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const AnimateIn = ({ children, className = "", delay = 0, y = 32 }) => {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const CountUp = ({ end, prefix = "", suffix = "", duration = 2000 }) => {
  const [ref, vis] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!vis) return;
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) {
        setVal(end);
        clearInterval(id);
      } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [vis, end, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {typeof end === "number" && end >= 1000
        ? val.toLocaleString("pt-BR")
        : val}
      {suffix}
    </span>
  );
};

/* ─────────────────────── TOAST ─────────────────────── */
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
        borderRadius: 12,
        padding: "14px 20px",
        color: type === "success" ? "#A5F3C0" : "#FCA5A5",
        fontSize: 14,
        fontWeight: 500,
        backdropFilter: "blur(12px)",
        animation: "toast-in 0.3s ease-out",
        maxWidth: 360,
      }}
    >
      {type === "success" ? "✓ " : "✕ "}{message}
    </div>
  );
};

/* ─────────────────────── HEADER ─────────────────────── */
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Funcionalidades", href: "#features" },
    { label: "Simulador", href: "#simulator" },
    { label: "Planos", href: "#pricing" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(10,12,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3B82F6, #10B981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: "#fff",
              letterSpacing: -0.5,
            }}
          >
            Ax
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#F8FAFC", letterSpacing: -0.5 }}>
            Axion<span style={{ color: "#3B82F6" }}>Tax</span>
          </span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-desktop">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(248,250,252,0.6)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#F8FAFC")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(248,250,252,0.6)")}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "#3B82F6",
              padding: "8px 20px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2563EB")}
            onMouseLeave={(e) => (e.target.style.background = "#3B82F6")}
          >
            Começar agora
          </a>
        </nav>

        <button
          className="nav-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#F8FAFC",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            background: "rgba(10,12,20,0.98)",
            padding: "16px 24px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
          className="nav-mobile-menu"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                fontSize: 15,
                fontWeight: 500,
                color: "rgba(248,250,252,0.7)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              marginTop: 16,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "#3B82F6",
              padding: "10px 20px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Começar agora
          </a>
        </div>
      )}
    </header>
  );
};

/* ─────────────────────── HERO ─────────────────────── */
const Hero = () => {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: 140,
        paddingBottom: 100,
        background: "linear-gradient(180deg, #0A0C14 0%, #0F1724 50%, #0A0C14 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 500,
          background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
        <AnimateIn>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 28,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.7)", letterSpacing: 0.3 }}>
              Monitoramento fiscal em tempo real
            </span>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#F8FAFC",
              margin: 0,
            }}
          >
            Monitore, simule e{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              regularize
            </span>
            .
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              lineHeight: 1.65,
              color: "rgba(248,250,252,0.5)",
              maxWidth: 600,
              margin: "24px auto 0",
            }}
          >
            A plataforma que cruza débitos tributários com programas de regularização
            fiscal — para escritórios de contabilidade e advocacia tributária.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.35}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 40 }}>
            <a
              href="/login"
              className="btn-primary-glow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                background: "#3B82F6",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 10,
                textDecoration: "none",
                transition: "all 0.25s",
                boxShadow: "0 0 30px rgba(59,130,246,0.3)",
              }}
            >
              Teste grátis por 14 dias →
            </a>
            <a
              href="#simulator"
              className="btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(248,250,252,0.8)",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 10,
                textDecoration: "none",
                transition: "all 0.25s",
              }}
            >
              Simular economia
            </a>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.5}>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 56, flexWrap: "wrap" }}>
            {[
              { icon: "🔒", label: "SSL/TLS" },
              { icon: "🛡️", label: "LGPD" },
              { icon: "⚡", label: "99.9% Uptime" },
            ].map((b) => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(248,250,252,0.35)" }}>
                <span style={{ fontSize: 14 }}>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
};

/* ─────────────────────── STATS BAR ─────────────────────── */
const StatsBar = () => {
  const stats = [
    { value: 8, suffix: "+", label: "Programas Monitorados" },
    { value: 3, prefix: "R$ ", suffix: " tri", label: "Em Dívida Ativa" },
    { value: 100, suffix: "%", label: "Desc. em Multas" },
    { value: 2400, suffix: "+", label: "CNPJs Atendidos" },
  ];

  return (
    <section style={{ background: "#0A0C14", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
        {stats.map((s, i) => (
          <AnimateIn key={s.label} delay={i * 0.08}>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(135deg, #3B82F6, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: 0,
                }}
              >
                <CountUp end={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
              </p>
              <p style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginTop: 4 }}>{s.label}</p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────── SIMULATOR ─────────────────────── */
const Simulator = () => {
  const [debito, setDebito] = useState(485000);
  const [desconto, setDesconto] = useState(45);
  const [parcelas, setParcelas] = useState(60);

  const economia = debito * (desconto / 100);
  const valorFinal = debito - economia;
  const parcelaMensal = parcelas > 0 ? valorFinal / parcelas : 0;

  const inputStyle = {
    width: "100%",
    height: 48,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "0 16px",
    fontSize: 15,
    fontWeight: 600,
    color: "#F8FAFC",
    outline: "none",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <section id="simulator" style={{ background: "#0F1724", padding: "100px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", margin: 0 }}>
              Simulador de{" "}
              <span style={{ background: "linear-gradient(135deg, #10B981, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Economia
              </span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(248,250,252,0.45)", marginTop: 12, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
              Simule quanto sua carteira pode economizar com programas de regularização
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "clamp(24px, 4vw, 40px)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)", marginBottom: 8 }}>
                  Débito Original (R$)
                </label>
                <input
                  type="text"
                  value={debito.toLocaleString("pt-BR")}
                  onChange={(e) => {
                    const n = parseInt(e.target.value.replace(/\D/g, "")) || 0;
                    setDebito(n);
                  }}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)", marginBottom: 8 }}>
                  Desconto (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={desconto}
                  onChange={(e) => setDesconto(Math.min(100, Math.max(0, Number(e.target.value))))}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.5)" }}>Parcelas</label>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6" }}>{parcelas}x</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={120}
                  step={6}
                  value={parcelas}
                  onChange={(e) => setParcelas(Number(e.target.value))}
                  className="custom-slider"
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "rgba(248,250,252,0.25)" }}>
                  <span>12x</span>
                  <span>120x</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {[
                { label: "Débito Original", value: fmt(debito), color: "#EF4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.12)" },
                { label: "Economia Estimada", value: fmt(economia), color: "#10B981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.12)" },
                { label: "Valor Final", value: fmt(valorFinal), color: "#3B82F6", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.12)" },
                { label: "Parcela Mensal", value: fmt(parcelaMensal), color: "#8B5CF6", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.12)" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="result-card"
                  style={{
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    borderRadius: 14,
                    padding: "20px 16px",
                    textAlign: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(248,250,252,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {c.label}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: c.color, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", margin: 0 }}>
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
};

/* ─────────────────────── FEATURES ─────────────────────── */
const Features = () => {
  const features = [
    { icon: "📡", title: "Monitoramento de Carteira", desc: "Acompanhe automaticamente todos os programas de regularização fiscal disponíveis para seus clientes.", accent: "#3B82F6" },
    { icon: "⚡", title: "Match Inteligente", desc: "Cruze débitos com programas ativos e identifique oportunidades de economia em segundos.", accent: "#10B981" },
    { icon: "📊", title: "Simulador de Economia", desc: "Simule cenários de parcelamento e desconto para cada CNPJ da sua carteira.", accent: "#8B5CF6" },
    { icon: "📋", title: "Relatórios Profissionais", desc: "Gere relatórios detalhados e personalizados para apresentar aos seus clientes.", accent: "#F59E0B" },
  ];

  return (
    <section id="features" style={{ background: "#0A0C14", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", margin: 0 }}>
              Tudo que você precisa para{" "}
              <span style={{ background: "linear-gradient(135deg, #3B82F6, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                gestão fiscal
              </span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(248,250,252,0.45)", marginTop: 12 }}>
              Ferramentas poderosas para escritórios de contabilidade e advocacia tributária
            </p>
          </div>
        </AnimateIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <AnimateIn key={f.title} delay={i * 0.1}>
              <div
                className="feature-card"
                data-accent={f.accent}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: 32,
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${f.accent}12`,
                    border: `1px solid ${f.accent}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 20,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(248,250,252,0.45)", margin: 0 }}>{f.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────── PRICING ─────────────────────── */
const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  const plans = [
    { name: "Starter", price: 149, desc: "Para pequenos escritórios", cnpjs: "Até 50 CNPJs", features: ["Monitoramento básico", "Simulador de economia", "Relatórios em PDF", "Suporte por e-mail"], highlight: false },
    { name: "Profissional", price: 349, desc: "Para escritórios em crescimento", cnpjs: "Até 200 CNPJs", features: ["Tudo do Starter", "Match inteligente", "Relatórios personalizados", "Suporte prioritário", "API de integração"], highlight: true },
    { name: "Escritório", price: 699, desc: "Para grandes operações", cnpjs: "Até 500 CNPJs", features: ["Tudo do Profissional", "Multi-usuários", "Dashboard avançado", "Gestor de conta dedicado"], highlight: false },
    { name: "Enterprise", price: null, desc: "Para operações ilimitadas", cnpjs: "CNPJs ilimitados", features: ["Tudo do Escritório", "SLA personalizado", "Integração sob medida", "Treinamento in-company"], highlight: false },
  ];

  const getPrice = (p) => {
    if (!p) return "Sob consulta";
    const val = annual ? Math.round(p * 0.8) : p;
    return `R$ ${val}`;
  };

  return (
    <section id="pricing" style={{ background: "#0F1724", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <AnimateIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em", margin: 0 }}>
              Planos que{" "}
              <span style={{ background: "linear-gradient(135deg, #3B82F6, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                escalam
              </span>{" "}
              com você
            </h2>
            <p style={{ fontSize: 16, color: "rgba(248,250,252,0.45)", marginTop: 12 }}>
              Escolha o plano ideal para o tamanho da sua operação
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 0, marginTop: 28, background: "rgba(255,255,255,0.04)", borderRadius: 100, padding: 4 }}>
              <button
                onClick={() => setAnnual(false)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: !annual ? "#3B82F6" : "transparent",
                  color: !annual ? "#fff" : "rgba(248,250,252,0.5)",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: annual ? "#3B82F6" : "transparent",
                  color: annual ? "#fff" : "rgba(248,250,252,0.5)",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                Anual <span style={{ marginLeft: 4, fontSize: 11, color: annual ? "#A5F3C0" : "#10B981", fontWeight: 700 }}>-20%</span>
              </button>
            </div>
          </div>
        </AnimateIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          {plans.map((plan, i) => (
            <AnimateIn key={plan.name} delay={i * 0.08}>
              <div
                className="pricing-card"
                style={{
                  background: plan.highlight ? "linear-gradient(180deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))" : "rgba(255,255,255,0.02)",
                  border: plan.highlight ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                  transition: "all 0.3s",
                }}
              >
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -1, left: 24, right: 24, height: 2, background: "linear-gradient(90deg, transparent, #3B82F6, transparent)", borderRadius: 2 }} />
                )}
                {plan.highlight && (
                  <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                    Mais popular
                  </span>
                )}

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginTop: 4 }}>{plan.desc}</p>

                <div style={{ marginTop: 20, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.03em" }}>
                    {getPrice(plan.price)}
                  </span>
                  {plan.price && <span style={{ fontSize: 14, color: "rgba(248,250,252,0.35)" }}>/mês</span>}
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(248,250,252,0.35)", marginBottom: 24 }}>{plan.cnpjs}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, fontSize: 14, color: "rgba(248,250,252,0.6)" }}>
                      <span style={{ color: "#10B981", fontSize: 16, lineHeight: "20px", flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="/login"
                  className={plan.highlight ? "btn-pricing-highlight" : "btn-pricing"}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 28,
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "all 0.25s",
                    background: plan.highlight ? "#3B82F6" : "rgba(255,255,255,0.06)",
                    color: plan.highlight ? "#fff" : "rgba(248,250,252,0.7)",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {plan.name === "Enterprise" ? "Falar com vendas" : "Começar agora"}
                </a>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────── CTA SECTION ─────────────────────── */
const CtaSection = () => {
  return (
    <section id="cta" style={{ background: "#0A0C14", padding: "100px 0" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <AnimateIn>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 24,
              padding: "clamp(40px, 6vw, 60px) clamp(24px, 5vw, 48px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -1, left: 40, right: 40, height: 2, background: "linear-gradient(90deg, transparent, #3B82F6, #10B981, transparent)", borderRadius: 2 }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#F8FAFC", margin: 0, letterSpacing: "-0.02em" }}>
              Pronto para começar?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(248,250,252,0.45)", marginTop: 12, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Teste gratuitamente por 14 dias. Sem cartão de crédito.
            </p>
            <a
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 28,
                padding: "14px 36px",
                background: "#3B82F6",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 10,
                textDecoration: "none",
                transition: "all 0.25s",
                boxShadow: "0 0 30px rgba(59,130,246,0.3)",
              }}
            >
              Criar conta grátis →
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
};

/* ─────────────────────── FOOTER ─────────────────────── */
const Footer = () => {
  return (
    <footer style={{ background: "#0A0C14", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "40px 0" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #3B82F6, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, color: "#fff" }}>
            Ax
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>
            Axion<span style={{ color: "#3B82F6" }}>Tax</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(248,250,252,0.3)" }}>
          © {new Date().getFullYear()} AxionTax. Todos os direitos reservados.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Termos", "Privacidade", "LGPD"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: "rgba(248,250,252,0.35)", textDecoration: "none", transition: "color 0.2s" }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

/* ─────────────────────── GLOBAL STYLES ─────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap');

    :root {
      --font-display: 'Outfit', sans-serif;
      --font-body: 'Instrument Sans', sans-serif;
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: var(--font-body);
      background: #0A0C14;
      color: #F8FAFC;
      overflow-x: hidden;
    }

    ::selection {
      background: rgba(59,130,246,0.3);
      color: #F8FAFC;
    }

    .custom-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: linear-gradient(90deg, #3B82F6, #10B981);
      outline: none;
    }
    .custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #F8FAFC;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(59,130,246,0.4);
      border: 2px solid #3B82F6;
      transition: transform 0.15s;
    }
    .custom-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }
    .custom-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #F8FAFC;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(59,130,246,0.4);
      border: 2px solid #3B82F6;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] { -moz-appearance: textfield; }

    @media (max-width: 768px) {
      .nav-desktop { display: none !important; }
      .nav-mobile-btn { display: block !important; }
    }
    @media (min-width: 769px) {
      .nav-mobile-btn { display: none !important; }
      .nav-mobile-menu { display: none !important; }
    }

    .feature-card:hover {
      border-color: rgba(255,255,255,0.12) !important;
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .pricing-card:hover {
      transform: translateY(-4px);
    }
    .btn-primary-glow:hover {
      background: #2563EB !important;
      box-shadow: 0 0 40px rgba(59,130,246,0.45) !important;
      transform: translateY(-1px);
    }
    .btn-outline:hover {
      background: rgba(255,255,255,0.08) !important;
      border-color: rgba(255,255,255,0.18) !important;
    }
    .btn-pricing:hover {
      background: rgba(255,255,255,0.1) !important;
      transform: translateY(-1px);
    }
    .btn-pricing-highlight:hover {
      background: #2563EB !important;
      transform: translateY(-1px);
    }
  `}</style>
);

/* ─────────────────────── APP ─────────────────────── */
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Hero />
      <StatsBar />
      <Simulator />
      <Features />
      <Pricing />
      <CtaSection />
      <Footer />
    </>
  );
}
