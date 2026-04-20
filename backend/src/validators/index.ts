import { z } from "zod";

// Auth validators
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    email: z.string().email("Invalid email").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    password: z.string().optional(),
    otp: z.string().length(6, "OTP must be 6 digits").optional(),
  }),
});

export const otpRequestSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    type: z.enum(["LOGIN", "REGISTER", "RESET_PASSWORD"]),
  }),
});

// Product validators
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    nameHi: z.string().optional(),
    description: z.string().min(10),
    descHi: z.string().optional(),
    categoryId: z.string().uuid(),
    price: z.number().positive(),
    salePrice: z.number().positive().optional(),
    sku: z.string().min(2),
    stock: z.number().int().min(0),
    fabric: z.string().optional(),
    color: z.string().optional(),
    sizes: z.array(z.string()),
    tags: z.array(z.string()).optional(),
  }),
});

// Cart validators
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
    size: z.string().optional(),
  }),
});

// Order validators
export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.enum(["COD", "ONLINE"]),
    notes: z.string().optional(),
  }),
});

// Address validators
export const addressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    addressLine: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    landmark: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});
