import { cartRepository } from "../repositories/cartRepository";
import { productRepository } from "../repositories/productRepository";
import { AppError } from "../middleware/errorHandler";

export class CartService {
  async getCart(userId: string) {
    const cart = await cartRepository.getOrCreate(userId);

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return {
      ...cart,
      subtotal,
      shippingCharge: subtotal >= 999 ? 0 : 99,
      total: subtotal + (subtotal >= 999 ? 0 : 99),
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addToCart(userId: string, productId: string, quantity: number, size?: string) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) {
      throw new AppError("Product not found", 404);
    }

    if (product.stock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    await cartRepository.addItem(userId, productId, quantity, size);
    return this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    await cartRepository.updateItemQuantity(itemId, quantity);
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await cartRepository.removeItem(itemId);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await cartRepository.clear(userId);
    return { message: "Cart cleared" };
  }
}

export const cartService = new CartService();
