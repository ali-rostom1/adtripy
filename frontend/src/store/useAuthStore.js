import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  login as loginApi, 
  logout as logoutApi, 
  register as registerApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi
} from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      loading: false,

      // Check logged in status
      checkAuth: async () => {
        try {
          const state = get();
          return !!state.accessToken;
        } catch (error) {
          console.error('Auth check error:', error);
          return false;
        }
      },

      // Login
      login: async (email, password) => {
        set({ loading: true });
        try {
          const response = await loginApi(email, password);
          set({
            isLoggedIn: true,
            user: response.user,
            accessToken: response.access_token,
            loading: false
          });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Register
      register: async (firstName, lastName, email, password, password_confirmation, userType) => {
        set({ loading: true });
        try {
          const response = await registerApi(firstName, lastName, email, password, password_confirmation, userType);
          set({ loading: false });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true });
        try {
          await logoutApi();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            isLoggedIn: false,
            user: null,
            accessToken: null,
            loading: false
          });
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        set({ loading: true });
        try {
          const response = await forgotPasswordApi(email);
          set({ loading: false });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Reset password
      resetPassword: async (email, token, password, password_confirmation) => {
        set({ loading: true });
        try {
          const response = await resetPasswordApi(email, token, password, password_confirmation);
          set({ loading: false });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;