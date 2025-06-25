import { useAuthStore } from "../store/AuthStore";

export function useAuth() {
  const { user, token, setUser, setToken, logout } = useAuthStore();
  // Add logic for checking auth, refreshing token, etc.
  return { user, token, setUser, setToken, logout };
}
