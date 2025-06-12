import {create} from 'zustand';



const useAuthStore = create((set) => ({
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
