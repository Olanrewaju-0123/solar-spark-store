import { Router } from "express";
import { createDiscountCode, validateDiscountCode, listDiscountCodes } from "../controllers/discountCodes.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * @openapi
 * /api/discount-codes:
 *   post:
 *     summary: Create a new discount code (Admin only)
 *     tags: [Discount Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *               - type
 *               - value
 *               - validUntil
 *             properties:
 *               code:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               value:
 *                 type: number
 *                 minimum: 0
 *               minOrderAmount:
 *                 type: number
 *                 minimum: 0
 *               maxDiscountAmount:
 *                 type: number
 *                 minimum: 0
 *               usageLimit:
 *                 type: integer
 *                 minimum: 1
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Discount code created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Discount code already exists
 *   get:
 *     summary: List all discount codes (Admin only)
 *     tags: [Discount Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of discount codes
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/", authenticateToken, requireAdmin, createDiscountCode);
router.get("/", authenticateToken, requireAdmin, listDiscountCodes);

/**
 * @openapi
 * /api/discount-codes/validate:
 *   post:
 *     summary: Validate a discount code
 *     tags: [Discount Codes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - orderAmount
 *             properties:
 *               code:
 *                 type: string
 *               orderAmount:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Discount code validated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Discount code not found
 */
router.post("/validate", validateDiscountCode);

export default router;
