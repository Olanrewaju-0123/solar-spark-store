import { z } from "zod";

/**
 * Inventory reservation item validation schema
 */
export const inventoryReservationItemSchema = z.object({
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
 * Reserve inventory validation schema
 */
export const reserveInventorySchema = z.object({
  items: z
    .array(inventoryReservationItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Cannot reserve more than 50 different products"),
  sessionId: z
    .string()
    .max(255, "Session ID must be less than 255 characters")
    .optional(),
  reservationMinutes: z
    .number()
    .int("Reservation minutes must be an integer")
    .min(1, "Reservation must be at least 1 minute")
    .max(1440, "Reservation cannot exceed 24 hours (1440 minutes)")
    .default(15),
});

/**
 * Confirm reservation validation schema
 */
export const confirmReservationSchema = z.object({
  reservationIds: z
    .array(z.number().int().positive("Invalid reservation ID"))
    .min(1, "At least one reservation ID is required")
    .max(100, "Cannot confirm more than 100 reservations at once"),
  orderId: z
    .number()
    .int("Order ID must be an integer")
    .positive("Order ID must be positive"),
});

/**
 * Cancel reservation validation schema
 */
export const cancelReservationSchema = z.object({
  reservationIds: z
    .array(z.number().int().positive("Invalid reservation ID"))
    .min(1, "At least one reservation ID is required")
    .max(100, "Cannot cancel more than 100 reservations at once"),
});

/**
 * Inventory query parameters validation schema
 */
export const inventoryQuerySchema = z.object({
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
    .enum(["active", "confirmed", "expired", "cancelled"])
    .optional(),
  productId: z
    .string()
    .regex(/^\d+$/, "Product ID must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Product ID must be greater than 0")
    .optional(),
  sessionId: z
    .string()
    .max(255, "Session ID must be less than 255 characters")
    .optional(),
});

export type ReserveInventoryInput = z.infer<typeof reserveInventorySchema>;
export type ConfirmReservationInput = z.infer<typeof confirmReservationSchema>;
export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;
export type InventoryQueryInput = z.infer<typeof inventoryQuerySchema>;
export type InventoryReservationItemInput = z.infer<typeof inventoryReservationItemSchema>;
