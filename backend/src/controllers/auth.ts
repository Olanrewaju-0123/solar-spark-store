import type { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { createLogger } from "../config/logger.js";

const logger = createLogger("AuthController");

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "customer"]).optional().default("customer"),
});

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "24h" }
    );

    logger.info(`User ${email} logged in successfully`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error(error, "Login failed");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Register new user
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { email, password, role } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    logger.info(`New user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error(error, "Registration failed");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get current user profile
 * GET /api/auth/me
 */
export async function getProfile(req: Request, res: Response) {
  try {
    // This should be called after authenticateToken middleware
    const user = (req as any).user;

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error(error, "Get profile failed");
    res.status(500).json({ error: "Internal server error" });
  }
}
