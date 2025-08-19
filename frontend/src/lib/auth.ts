import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    },
  ),
);

export async function handleLogin(email: string, password: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const { idToken } = await res.json();
    useAuthStore.getState().setToken(idToken); // Set JWT in store
    // Redirect or update UI
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    window.location.href = '/';
  }
}

export async function handleLogout() {
  useAuthStore.getState().clearToken(); // Clear JWT
  window.location.href = '/auth/login';
}
