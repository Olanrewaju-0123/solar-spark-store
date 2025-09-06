import { z } from "zod";

/**
 * Discount code creation validation schema
 */
export const createDiscountCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Discount code is required")
    .max(50, "Discount code must be less than 50 characters")
    .regex(/^[A-Z0-9_-]+$/, "Discount code can only contain uppercase letters, numbers, hyphens, and underscores"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  type: z
    .enum(["fixed", "percentage"], {
      errorMap: () => ({ message: "Type must be either 'fixed' or 'percentage'" }),
    }),
  value: z
    .number()
    .positive("Value must be a positive number"),
  minOrderAmount: z
    .number()
    .positive("Minimum order amount must be positive")
    .optional(),
  maxDiscountAmount: z
    .number()
    .positive("Maximum discount amount must be positive")
    .optional(),
  usageLimit: z
    .number()
    .int("Usage limit must be an integer")
    .positive("Usage limit must be positive")
    .optional(),
  validFrom: z
    .string()
    .datetime("Invalid valid from date format")
    .optional(),
  validUntil: z
    .string()
    .datetime("Invalid valid until date format"),
}).refine((data) => {
  if (data.validFrom && data.validUntil) {
    return new Date(data.validFrom) < new Date(data.validUntil);
  }
  return true;
}, {
  message: "Valid from date must be before valid until date",
  path: ["validFrom"],
}).refine((data) => {
  if (data.type === "percentage" && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: "Percentage value cannot exceed 100%",
  path: ["value"],
});

/**
 * Discount code validation schema
 */
export const validateDiscountCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Discount code is required"),
  orderAmount: z
    .number()
    .positive("Order amount must be positive"),
});

/**
 * Discount code query parameters validation schema
 */
export const discountCodeQuerySchema = z.object({
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
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  type: z
    .enum(["fixed", "percentage"])
    .optional(),
});

/**
 * Discount code ID parameter validation schema
 */
export const discountCodeIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Discount code ID must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Discount code ID must be greater than 0"),
});

export type CreateDiscountCodeInput = z.infer<typeof createDiscountCodeSchema>;
export type ValidateDiscountCodeInput = z.infer<typeof validateDiscountCodeSchema>;
export type DiscountCodeQueryInput = z.infer<typeof discountCodeQuerySchema>;
export type DiscountCodeIdInput = z.infer<typeof discountCodeIdSchema>;
