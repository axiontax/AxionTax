import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import {
  EmpresasPage,
  DividasPage,
  ProgramasPage,
  MatchesPage,
  EquipePage,
} from "./pages/PlaceholderPages.jsx";

function RequireOrg({ children }) {
  const { org, loading } = useAuth();
  if (loading)
    return (
      <div style={{ minHeight: "100vh", background: "#0A0C14", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(248,250,252,0.5)", fontSize: 14 }}>
        Carregando...
      </div>
    );
  if (!org) return <Navigate to="/onboarding" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/app" element={<ProtectedRoute><RequireOrg><DashboardLayout /></RequireOrg></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="empresas" element={<EmpresasPage />} />
            <Route path="dividas" element={<DividasPage />} />
            <Route path="programas" element={<ProgramasPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="equipe" element={<EquipePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
