import { z } from "zod";

/**
 * Product creation validation schema
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Product description is required")
    .max(2000, "Product description must be less than 2000 characters"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .max(999999.99, "Price must be less than $999,999.99"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  imageUrl: z
    .string()
    .url("Invalid image URL format")
    .optional(),
});

/**
 * Product update validation schema
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Product query parameters validation schema
 */
export const productQuerySchema = z.object({
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
    .default("12"),
  search: z
    .string()
    .max(100, "Search term must be less than 100 characters")
    .optional(),
  category: z
    .string()
    .max(100, "Category must be less than 100 characters")
    .optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .transform(Number)
    .refine((n) => n >= 0, "Minimum price cannot be negative")
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .transform(Number)
    .refine((n) => n >= 0, "Maximum price cannot be negative")
    .optional(),
  sortBy: z
    .enum(["name", "price", "createdAt", "stock"])
    .default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

/**
 * Product ID parameter validation schema
 */
export const productIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Product ID must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Product ID must be greater than 0"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;
