import api from "@/lib/api";
import type { ApiResponse, LoginResponse, User } from "@/types";

export const authApi = {
  register: async (data: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
  }): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/register", data);
    return response.data.data!;
  },

  login: async (data: {
    phone: string;
    password?: string;
    otp?: string;
  }): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    return response.data.data!;
  },

  requestOtp: async (phone: string, type: string): Promise<{ message: string }> => {
    const { data } = await api.post<ApiResponse<{ message: string }>>("/auth/request-otp", {
      phone,
      type,
    });
    return data.data!;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>("/auth/profile");
    return data.data!;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await api.put<ApiResponse<User>>("/auth/profile", updates);
    return data.data!;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/auth/logout", { refreshToken });
  },
};
