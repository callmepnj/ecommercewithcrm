import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { authApi } from "@/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: "EN" | "HI";
  login: (phone: string, password?: string, otp?: string) => Promise<void>;
  register: (data: { name: string; phone: string; email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setLanguage: (lang: "EN" | "HI") => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      language: "EN",

      login: async (phone, password, otp) => {
        set({ isLoading: true });
        try {
          const result = await authApi.login({ phone, password, otp });
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const result = await authApi.register(data);
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) await authApi.logout(refreshToken);
        } finally {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchProfile: async () => {
        try {
          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "aaina-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
      }),
    }
  )
);
