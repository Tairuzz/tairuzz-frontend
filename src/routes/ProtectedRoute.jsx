import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("tairuzz_auth");
  const clientId = localStorage.getItem("tairuzz_client_id");

  // User must have BOTH a token and a mapped clientId
  const isAuthenticated = Boolean(token && clientId);

  if (!isAuthenticated) {
    console.warn("ProtectedRoute: missing token or clientId — redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return children;
}
