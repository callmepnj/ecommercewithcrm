import api from "@/lib/api";
import type { Product, ApiResponse, Category } from "@/types";

interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

interface ProductListResponse {
  products: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const productApi = {
  getAll: async (params: ProductListParams = {}): Promise<ProductListResponse> => {
    const { data } = await api.get<ApiResponse<ProductListResponse>>("/products", { params });
    return data.data!;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return data.data!;
  },

  getFeatured: async (): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>("/products/featured");
    return data.data!;
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>("/products", product);
    return data.data!;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories");
    return data.data!;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data!;
  },
};
