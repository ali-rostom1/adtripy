import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

export default function AuthProvider({ children }) {
  const { token, refreshToken, user } = useAuthStore();
  const refreshTokenFn = useAuthStore((state) => state.refreshToken);
  const navigate = useNavigate();
  
  // Check authentication status on app load and refresh token if needed
  useEffect(() => {
    const checkAuth = async () => {
      // If we have a token but no user, try to refresh the token
      if (token && !user && refreshToken) {
        try {
          await refreshTokenFn();
        } catch (err) {
          console.error("Token refresh failed:", err);
          navigate("/login");
        }
      }
    };
    
    checkAuth();
    
    // Set up automatic token refresh every 25 minutes
    const refreshInterval = setInterval(() => {
      if (token && refreshToken) {
        refreshTokenFn().catch(console.error);
      }
    }, 25 * 60 * 1000); // 25 minutes
    
    return () => clearInterval(refreshInterval);
  }, [token, refreshToken, user, refreshTokenFn, navigate]);
  
  return children;
}