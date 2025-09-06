import { z } from "zod";

/**
 * Analytics event tracking validation schema
 */
export const trackEventSchema = z.object({
  eventType: z
    .enum([
      "page_view",
      "add_to_cart", 
      "remove_from_cart",
      "checkout_start",
      "checkout_complete",
      "product_view"
    ], {
      errorMap: () => ({ 
        message: "Event type must be one of: page_view, add_to_cart, remove_from_cart, checkout_start, checkout_complete, product_view" 
      }),
    }),
  userId: z
    .number()
    .int("User ID must be an integer")
    .positive("User ID must be positive")
    .optional(),
  sessionId: z
    .string()
    .max(255, "Session ID must be less than 255 characters")
    .optional(),
  productId: z
    .number()
    .int("Product ID must be an integer")
    .positive("Product ID must be positive")
    .optional(),
  orderId: z
    .number()
    .int("Order ID must be an integer")
    .positive("Order ID must be positive")
    .optional(),
  metadata: z
    .record(z.any())
    .optional(),
});

/**
 * Analytics summary query validation schema
 */
export const analyticsSummaryQuerySchema = z.object({
  days: z
    .string()
    .regex(/^\d+$/, "Days must be a number")
    .transform(Number)
    .refine((n) => n > 0 && n <= 365, "Days must be between 1 and 365")
    .default("30"),
});

/**
 * Analytics events query validation schema
 */
export const analyticsEventsQuerySchema = z.object({
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
    .default("50"),
  eventType: z
    .enum([
      "page_view",
      "add_to_cart",
      "remove_from_cart", 
      "checkout_start",
      "checkout_complete",
      "product_view"
    ])
    .optional(),
  days: z
    .string()
    .regex(/^\d+$/, "Days must be a number")
    .transform(Number)
    .refine((n) => n > 0 && n <= 365, "Days must be between 1 and 365")
    .default("7"),
  userId: z
    .string()
    .regex(/^\d+$/, "User ID must be a number")
    .transform(Number)
    .refine((n) => n > 0, "User ID must be greater than 0")
    .optional(),
  productId: z
    .string()
    .regex(/^\d+$/, "Product ID must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Product ID must be greater than 0")
    .optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type AnalyticsSummaryQueryInput = z.infer<typeof analyticsSummaryQuerySchema>;
export type AnalyticsEventsQueryInput = z.infer<typeof analyticsEventsQuerySchema>;
