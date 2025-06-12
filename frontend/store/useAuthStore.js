import {create} from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: null | { id: string; name: string };
  accessToken: string | null;
  refreshToken: string | null;
  login: (userData: { id: string; name: string }, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  login: (userData, tokens) => set({
    isLoggedIn: true,
    user: userData,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }),
  logout: () => set({
    isLoggedIn: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
  setTokens: (tokens) => set((state) => ({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken || state.refreshToken, // Keep old refresh token if new one isn't provided
  })),
}));

export default useAuthStore;
