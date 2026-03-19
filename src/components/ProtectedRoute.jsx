import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0A0C14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(248,250,252,0.5)",
          fontSize: 14,
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
