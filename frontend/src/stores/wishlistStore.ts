import { create } from "zustand";
import type { Wishlist } from "@/types";
import { wishlistApi } from "@/services/wishlistService";

interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const wishlist = await wishlistApi.get();
      set({ wishlist, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId) => {
    await wishlistApi.add(productId);
    await get().fetchWishlist();
  },

  removeItem: async (productId) => {
    await wishlistApi.remove(productId);
    await get().fetchWishlist();
  },

  isInWishlist: (productId) => {
    return get().wishlist?.items.some((item) => item.productId === productId) ?? false;
  },
}));
