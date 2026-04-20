import { create } from "zustand";
import type { Cart } from "@/types";
import { cartApi } from "@/services/cartService";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, size?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.get();
      set({ cart, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity, size) => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.addItem(productId, quantity, size);
      set({ cart, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error("Failed to add to cart");
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const cart = await cartApi.updateItem(itemId, quantity);
      set({ cart });
    } catch {
      throw new Error("Failed to update quantity");
    }
  },

  removeItem: async (itemId) => {
    try {
      const cart = await cartApi.removeItem(itemId);
      set({ cart });
    } catch {
      throw new Error("Failed to remove item");
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clear();
      set({ cart: null });
    } catch {
      throw new Error("Failed to clear cart");
    }
  },
}));
