import api from "@/lib/api";
import type { ApiResponse, Wishlist } from "@/types";

export const wishlistApi = {
  get: async (): Promise<Wishlist> => {
    const { data } = await api.get<ApiResponse<Wishlist>>("/wishlist");
    return data.data!;
  },

  add: async (productId: string): Promise<void> => {
    await api.post(`/wishlist/${productId}`);
  },

  remove: async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/${productId}`);
  },
};
