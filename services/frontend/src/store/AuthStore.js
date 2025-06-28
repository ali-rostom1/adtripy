import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  login as loginApi,
  register as registerApi,
  refreshToken as refreshApi,
  logout as logoutApi,
  updateUserInfo,
} from "../api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginApi({ email, password });
          const { user, access_token, refresh_token } = response;
          set({
            user,
            token: access_token,
            refreshToken: refresh_token,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
          });
          throw error;
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Registration data:", userData);
          console.log("API URL:", import.meta.env.VITE_AUTH_API_URL);

          const response = await registerApi(userData);
          console.log("Registration successful:", response.data);

          // Check if the response contains token and user data
          if (response.data.token && response.data.user) {
            set({
              user: response.data.user,
              token: response.data.token,
              refreshToken: response.data.refresh_token || null,
              isLoading: false,
            });
            return response.data;
          } else {
            // If the response structure is unexpected
            console.error("Invalid response structure:", response.data);
            set({
              isLoading: false,
              error:
                "Registration succeeded but returned an unexpected response format",
            });
            return null;
          }
        } catch (error) {
          console.error("Registration error:", error);
          console.error("Error response:", error.response?.data);

          // Get detailed error message
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Registration failed. Please try again.";

          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      // Refresh token
      refreshToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) return;

        set({ isLoading: true });
        try {
          const response = await refreshApi(currentRefreshToken);
          const { access_token, refresh_token } = response.data;
          set({
            token: access_token,
            refreshToken: refresh_token,
            isLoading: false,
          });
          return response.data;
        } catch (error) {
          // If refresh fails, logout
          get().logout();
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            // Call the logout API
            await logoutApi(token);
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Reset all auth-related state
          set(
            {
              user: null,
              token: null,
              refreshToken: null,
              error: null,
              isLoading: false,
            },
            true // true means replace state completely
          );

          // Manually remove from localStorage to fix persistence issues
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth-storage");
          }
        }
      },

      // Set user info
      setUser: (user) => set({ user }),

      // Set tokens
      setToken: (token, refreshToken) => set({ token, refreshToken }),

      // Clear errors
      clearError: () => set({ error: null }),

      // Update user information
      updateUser: async (updatedData) => {
        const token = get().token; // Get the token from the store
        if (!token) throw new Error("User is not authenticated");

        set({ isLoading: true, error: null });
        try {
          const response = await updateUserInfo(updatedData);
          set({ user: response.data.user, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Update failed",
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // Name of the localStorage key
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);
