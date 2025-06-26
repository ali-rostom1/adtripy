import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

export default function PrivateRoute({ children }) {
  const { user, token } = useAuthStore();
  
  // Debug: Log auth state
  console.log("PrivateRoute auth check:", { hasUser: !!user, hasToken: !!token });
  
  // Check if user is authenticated
  if (!user || !token) {
    console.log("Not authenticated, redirecting to login");
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
