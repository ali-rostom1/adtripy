import {create} from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: null | { id: string; name: string };
  login: (userData: { id: string; name: string }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));

export default useAuthStore;
