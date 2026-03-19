import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const navItems = [
  { label: "Início", path: "/app", icon: "⌂" },
  { label: "Empresas", path: "/app/empresas", icon: "🏢" },
  { label: "Dívidas", path: "/app/dividas", icon: "📋" },
  { label: "Programas", path: "/app/programas", icon: "📡" },
  { label: "Matches", path: "/app/matches", icon: "⚡" },
  { label: "Equipe", path: "/app/equipe", icon: "👥" },
];

export default function DashboardLayout() {
  const { profile, org, orgRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0C14" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : -260,
          zIndex: 50,
          transition: "left 0.3s ease",
        }}
        className="sidebar"
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
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
            }}
          >
            Ax
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>
              Axion<span style={{ color: "#3B82F6" }}>Tax</span>
            </div>
            {org && (
              <div style={{ fontSize: 11, color: "rgba(248,250,252,0.35)", marginTop: 1 }}>
                {org.name}
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: isActive(item.path) ? "rgba(59,130,246,0.1)" : "transparent",
                color: isActive(item.path) ? "#3B82F6" : "rgba(248,250,252,0.5)",
                fontSize: 14,
                fontWeight: isActive(item.path) ? 600 : 400,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "rgba(248,250,252,0.7)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(248,250,252,0.5)";
                }
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User / Logout */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(248,250,252,0.7)", marginBottom: 2 }}>
            {profile?.full_name || "Usuário"}
          </div>
          <div style={{ fontSize: 11, color: "rgba(248,250,252,0.3)", marginBottom: 12 }}>
            {orgRole === "owner" ? "Proprietário" : orgRole === "admin" ? "Admin" : "Membro"}
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "8px 0",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              background: "transparent",
              color: "rgba(248,250,252,0.5)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "rgba(239,68,68,0.3)";
              e.target.style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.color = "rgba(248,250,252,0.5)";
            }}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 0 }} className="main-content">
        {/* Mobile header */}
        <div
          className="mobile-header"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(10,12,20,0.95)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "#F8FAFC", fontSize: 22, cursor: "pointer" }}
          >
            ☰
          </button>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>
            Axion<span style={{ color: "#3B82F6" }}>Tax</span>
          </span>
          <div style={{ width: 22 }} />
        </div>

        <div style={{ padding: "32px 32px", maxWidth: 1100 }} className="content-area">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 769px) {
          .sidebar { left: 0 !important; }
          .main-content { margin-left: 260px !important; }
          .mobile-header { display: none !important; }
          .sidebar-overlay { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
          .content-area { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}
