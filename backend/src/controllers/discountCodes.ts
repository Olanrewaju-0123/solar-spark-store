import type { Request, Response } from "express";
import { DiscountCode } from "../models/DiscountCode.js";
import { createLogger } from "../config/logger.js";
import { 
  createDiscountCodeSchema, 
  validateDiscountCodeSchema,
  discountCodeQuerySchema 
} from "../validations/discountCodes.js";

const logger = createLogger("DiscountCodeController");

/**
 * Create a new discount code (Admin only)
 * POST /api/discount-codes
 */
export async function createDiscountCode(req: Request, res: Response) {
  try {
    const parsed = createDiscountCodeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const data = parsed.data;
    const validFrom = data.validFrom ? new Date(data.validFrom) : new Date();
    const validUntil = new Date(data.validUntil);

    const discountCode = await DiscountCode.create({
      code: data.code,
      description: data.description,
      type: data.type,
      value: data.value,
      ...(data.minOrderAmount !== undefined && {
        minOrderAmount: data.minOrderAmount,
      }),
      ...(data.maxDiscountAmount !== undefined && {
        maxDiscountAmount: data.maxDiscountAmount,
      }),
      ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
      validFrom,
      validUntil,
      isActive: true,
      usedCount: 0,
    });

    logger.info(`Discount code created: ${data.code}`);

    res.status(201).json({
      success: true,
      data: discountCode,
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Discount code already exists" });
    }
    logger.error(error, "Failed to create discount code");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Validate a discount code
 * POST /api/discount-codes/validate
 */
export async function validateDiscountCode(req: Request, res: Response) {
  try {
    const parsed = validateDiscountCodeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { code, orderAmount } = parsed.data;

    const discountCode = await DiscountCode.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode) {
      return res.status(404).json({ error: "Discount code not found" });
    }

    const discount = discountCode.calculateDiscount(orderAmount);

    res.json({
      success: true,
      data: {
        code: discountCode.code,
        description: discountCode.description,
        discount,
        type: discountCode.type,
        value: discountCode.value,
      },
    });
  } catch (error) {
    logger.error(error, "Failed to validate discount code");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * List all discount codes (Admin only)
 * GET /api/discount-codes
 */
export async function listDiscountCodes(req: Request, res: Response) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    const { count, rows } = await DiscountCode.findAndCountAll({
      limit: Number(pageSize),
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        items: rows,
        total: count,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(count / Number(pageSize)),
      },
    });
  } catch (error) {
    logger.error(error, "Failed to list discount codes");
    res.status(500).json({ error: "Internal server error" });
  }
}
