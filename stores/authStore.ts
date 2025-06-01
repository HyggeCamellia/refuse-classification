import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { id: string; name: string } | null;
  isAuthenticated: boolean;
  login: (token: string, user: { id: string; name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ 
        token, 
        user,
        isAuthenticated: true 
      }),
      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false
      })
    }),
    {
      name: 'auth-storage', // LocalStorage 的 key
    }
  )
);


export default useAuthStore;