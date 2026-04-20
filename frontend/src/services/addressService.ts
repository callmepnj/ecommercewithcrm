import api from "@/lib/api";
import type { ApiResponse, Address } from "@/types";

export const addressApi = {
  getAll: async (): Promise<Address[]> => {
    const { data } = await api.get<ApiResponse<Address[]>>("/addresses");
    return data.data!;
  },

  create: async (address: Omit<Address, "id" | "userId">): Promise<Address> => {
    const { data } = await api.post<ApiResponse<Address>>("/addresses", address);
    return data.data!;
  },

  update: async (id: string, address: Partial<Address>): Promise<Address> => {
    const { data } = await api.put<ApiResponse<Address>>(`/addresses/${id}`, address);
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
};
