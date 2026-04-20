import { Response, NextFunction } from "express";
import { orderService } from "../services/orderService";
import { AuthRequest } from "../middleware/auth";

export class OrderController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.createOrder(req.userId!, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await orderService.getUserOrders(req.userId!, page);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.verifyPayment(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async trackOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.trackOrder(req.params.orderNumber);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
