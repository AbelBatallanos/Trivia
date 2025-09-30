import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string; name: string } | null;
  token: string | null;
  login: (userData: { id: string; name: string }, token: string) => void; // <-- MODIFICAR
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,

  login: (userData, token) => set({ isLoggedIn: true, user: userData, token }), 
  logout: () => set({ isLoggedIn: false, user: null, token: null }),
}));