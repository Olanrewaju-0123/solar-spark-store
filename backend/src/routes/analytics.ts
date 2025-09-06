import { Router } from "express";
import { trackEvent, getAnalyticsSummary, getAnalyticsEvents } from "../controllers/analytics.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * @openapi
 * /api/analytics/track:
 *   post:
 *     summary: Track an analytics event
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventType
 *             properties:
 *               eventType:
 *                 type: string
 *                 enum: [page_view, add_to_cart, remove_from_cart, checkout_start, checkout_complete, product_view]
 *               userId:
 *                 type: integer
 *               sessionId:
 *                 type: string
 *               productId:
 *                 type: integer
 *               orderId:
 *                 type: integer
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Event tracked successfully
 *       400:
 *         description: Validation failed
 */
router.post("/track", trackEvent);

/**
 * @openapi
 * /api/analytics/summary:
 *   get:
 *     summary: Get analytics summary (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to include in summary
 *     responses:
 *       200:
 *         description: Analytics summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/summary", authenticateToken, requireAdmin, getAnalyticsSummary);

/**
 * @openapi
 * /api/analytics/events:
 *   get:
 *     summary: Get analytics events (Admin only)
 *     tags: [Analytics]
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
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           enum: [page_view, add_to_cart, remove_from_cart, checkout_start, checkout_complete, product_view]
 *         description: Filter by event type
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to include
 *     responses:
 *       200:
 *         description: List of analytics events
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/events", authenticateToken, requireAdmin, getAnalyticsEvents);

export default router;
