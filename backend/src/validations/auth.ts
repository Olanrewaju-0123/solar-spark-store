import { z } from "zod";

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  role: z
    .enum(["admin", "customer"])
    .default("customer")
    .optional(),
});

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required"),
});

/**
 * Password update validation schema
 */
export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must be less than 100 characters"),
});

/**
 * Profile update validation schema
 */
export const updateProfileSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .optional(),
  role: z
    .enum(["admin", "customer"])
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
