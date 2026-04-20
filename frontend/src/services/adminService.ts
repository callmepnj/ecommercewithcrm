import api from "@/lib/api";
import type { DashboardStats, Order, Product, Category, User } from "@/types";

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get("/admin/dashboard");
    return data.data;
  },

  // Orders
  getAllOrders: async (page = 1, status?: string): Promise<{ orders: Order[]; pagination: any }> => {
    const params: any = { page, limit: 20 };
    if (status) params.status = status;
    const { data } = await api.get("/admin/orders", { params });
    return data.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const { data } = await api.put(`/admin/orders/${orderId}/status`, { status });
    return data.data;
  },

  // Products
  createProduct: async (productData: any): Promise<Product> => {
    const { data } = await api.post("/products", productData);
    return data.data;
  },

  updateProduct: async (id: string, productData: any): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  uploadProductImage: async (productId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post(`/upload/product-image/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  deleteProductImage: async (imageId: string): Promise<void> => {
    await api.delete(`/upload/product-image/${imageId}`);
  },

  // Categories
  createCategory: async (categoryData: any): Promise<Category> => {
    const { data } = await api.post("/categories", categoryData);
    return data.data;
  },

  updateCategory: async (id: string, categoryData: any): Promise<Category> => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Products (list for admin)
  getProducts: async (page = 1) => {
    const { data } = await api.get("/products", { params: { page, limit: 20 } });
    return data.data;
  },

  // Categories (list)
  getCategories: async () => {
    const { data } = await api.get("/categories");
    return data.data;
  },

  // Users
  getAllUsers: async (page = 1): Promise<{ users: User[]; pagination: any }> => {
    const { data } = await api.get("/admin/users", { params: { page, limit: 20 } });
    return data.data;
  },
};
