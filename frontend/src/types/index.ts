// Product types
export interface Product {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  description: string;
  descHi?: string;
  descriptionHi?: string;
  categoryId: string;
  category: { name: string; nameHi?: string; slug: string };
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  fabric?: string;
  color?: string;
  sizes: string[];
  weight?: number;
  careInstr?: string;
  tags: string[];
  images: ProductImage[];
  reviews?: Review[];
  _count?: { reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

// User types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN";
  avatar?: string;
  language: "EN" | "HI";
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

// Cart types
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  itemCount: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: { name: string; phone: string; email?: string };
  addressId: string;
  address?: Address;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  razorpayOrderId?: string;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  price: number;
  total: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

// Wishlist
export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Review
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: { name: string };
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Dashboard
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders?: any[];
}
