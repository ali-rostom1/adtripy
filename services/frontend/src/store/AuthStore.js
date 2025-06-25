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
          const { user, access_token, refresh_token } = response.data;
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
          const response = await registerApi(userData);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Registration failed",
          });
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
          await logoutApi(token);
          set({ user: null, token: null, refreshToken: null });
          localStorage.removeItem("auth-storage");
        } catch (error) {
          console.error("Logout failed:", error);
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
