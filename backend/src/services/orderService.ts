import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "../config";
import { orderRepository } from "../repositories/orderRepository";
import { cartRepository } from "../repositories/cartRepository";
import { productRepository } from "../repositories/productRepository";
import { AppError } from "../middleware/errorHandler";

let razorpay: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpay) {
    if (!config.razorpay.keyId) {
      throw new AppError("Razorpay is not configured", 500);
    }
    razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpay;
}

export class OrderService {
  async createOrder(
    userId: string,
    data: { addressId: string; paymentMethod: "COD" | "ONLINE"; notes?: string }
  ) {
    const cart = await cartRepository.getOrCreate(userId);

    if (cart.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    // Validate stock
    for (const item of cart.items) {
      const product = await productRepository.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new AppError(`${product?.name || "Product"} is out of stock`, 400);
      }
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size || undefined,
      price: item.product.salePrice || item.product.price,
    }));

    const order = await orderRepository.create({
      userId,
      addressId: data.addressId,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      items: orderItems,
    });

    // Clear cart after order
    await cartRepository.clear(userId);

    // Create Razorpay order for online payment
    if (data.paymentMethod === "ONLINE") {
      const razorpayOrder = await getRazorpay().orders.create({
        amount: Math.round(order.total * 100), // paise
        currency: "INR",
        receipt: order.orderNumber,
      });

      await orderRepository.updatePayment(order.id, {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "PENDING",
      });

      return { order, razorpayOrderId: razorpayOrder.id };
    }

    return { order };
  }

  async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const expectedSignature = crypto
      .createHmac("sha256", config.razorpay.keySecret)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      throw new AppError("Payment verification failed", 400);
    }

    await orderRepository.updatePayment(data.orderId, {
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      paymentStatus: "PAID",
    });

    await orderRepository.updateStatus(data.orderId, "CONFIRMED");

    return { message: "Payment verified successfully" };
  }

  async getUserOrders(userId: string, page?: number) {
    return orderRepository.findByUser(userId, page);
  }

  async getOrderById(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    return order;
  }

  async trackOrder(orderNumber: string) {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      items: order.items,
    };
  }

  async updateOrderStatus(orderId: string, status: string) {
    return orderRepository.updateStatus(orderId, status);
  }

  async getAllOrders(page?: number, status?: string) {
    return orderRepository.getAll(page, undefined, status);
  }

  async getDashboardStats() {
    return orderRepository.getDashboardStats();
  }
}

export const orderService = new OrderService();
