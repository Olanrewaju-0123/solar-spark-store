import { z } from "zod";

/**
 * Order item validation schema
 */
export const orderItemSchema = z.object({
  productId: z
    .number()
    .int("Product ID must be an integer")
    .positive("Product ID must be positive"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be positive")
    .max(1000, "Quantity cannot exceed 1000"),
});

/**
 * Order creation validation schema
 */
export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(255, "Customer name must be less than 255 characters"),
  customerEmail: z
    .string()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters"),
  customerPhone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters"),
  shippingAddress: z.object({
    street: z
      .string()
      .min(1, "Street address is required")
      .max(255, "Street address must be less than 255 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City must be less than 100 characters"),
    state: z
      .string()
      .min(1, "State is required")
      .max(100, "State must be less than 100 characters"),
    zipCode: z
      .string()
      .min(1, "ZIP code is required")
      .max(20, "ZIP code must be less than 20 characters"),
    country: z
      .string()
      .min(1, "Country is required")
      .max(100, "Country must be less than 100 characters"),
  }),
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Cannot order more than 50 different products"),
  discountCode: z
    .string()
    .max(50, "Discount code must be less than 50 characters")
    .optional(),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});

/**
 * Order update validation schema
 */
export const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  trackingNumber: z
    .string()
    .max(100, "Tracking number must be less than 100 characters")
    .optional(),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});

/**
 * Order query parameters validation schema
 */
export const orderQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Page must be greater than 0")
    .default("1"),
  pageSize: z
    .string()
    .regex(/^\d+$/, "Page size must be a number")
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, "Page size must be between 1 and 100")
    .default("20"),
  status: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  customerEmail: z
    .string()
    .email("Invalid email format")
    .optional(),
  sortBy: z
    .enum(["createdAt", "totalAmount", "status"])
    .default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

/**
 * Order ID parameter validation schema
 */
export const orderIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Order ID must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Order ID must be greater than 0"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type OrderIdInput = z.infer<typeof orderIdSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
