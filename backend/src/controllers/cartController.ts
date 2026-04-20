import { Response, NextFunction } from "express";
import { cartService } from "../services/cartService";
import { AuthRequest } from "../middleware/auth";

export class CartController {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.userId!);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId, quantity, size } = req.body;
      const cart = await cartService.addToCart(req.userId!, productId, quantity, size);
      res.status(201).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { quantity } = req.body;
      const cart = await cartService.updateQuantity(req.userId!, req.params.itemId, quantity);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.removeItem(req.userId!, req.params.itemId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.clearCart(req.userId!);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
