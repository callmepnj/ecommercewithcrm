import api from "@/lib/api";
import type { ApiResponse, Order } from "@/types";

interface OrderListResponse {
  orders: Order[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const orderApi = {
  create: async (data: {
    addressId: string;
    paymentMethod: "COD" | "ONLINE";
    notes?: string;
  }): Promise<{ order: Order; razorpayOrderId?: string }> => {
    const response = await api.post<
      ApiResponse<{ order: Order; razorpayOrderId?: string }>
    >("/orders", data);
    return response.data.data!;
  },

  verifyPayment: async (data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/orders/verify-payment",
      data
    );
    return response.data.data!;
  },

  getUserOrders: async (page = 1): Promise<OrderListResponse> => {
    const { data } = await api.get<ApiResponse<OrderListResponse>>("/orders", {
      params: { page },
    });
    return data.data!;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data!;
  },

  track: async (orderNumber: string) => {
    const { data } = await api.get(`/orders/track/${orderNumber}`);
    return data.data;
  },
};
