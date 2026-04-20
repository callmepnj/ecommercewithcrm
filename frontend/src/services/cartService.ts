import api from "@/lib/api";
import type { ApiResponse, Cart } from "@/types";

export const cartApi = {
  get: async (): Promise<Cart> => {
    const { data } = await api.get<ApiResponse<Cart>>("/cart");
    return data.data!;
  },

  addItem: async (productId: string, quantity: number, size?: string): Promise<Cart> => {
    const { data } = await api.post<ApiResponse<Cart>>("/cart/items", {
      productId,
      quantity,
      size,
    });
    return data.data!;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return data.data!;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return data.data!;
  },

  clear: async (): Promise<void> => {
    await api.delete("/cart");
  },
};
