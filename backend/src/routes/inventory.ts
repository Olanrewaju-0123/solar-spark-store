import { Router } from "express";
import { 
  reserveInventory, 
  confirmReservation, 
  cancelReservation, 
  cleanupExpiredReservations 
} from "../controllers/inventory.js";

const router = Router();

/**
 * @openapi
 * /api/inventory/reserve:
 *   post:
 *     summary: Reserve inventory for checkout
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               sessionId:
 *                 type: string
 *               reservationMinutes:
 *                 type: integer
 *                 default: 15
 *     responses:
 *       200:
 *         description: Inventory reserved successfully
 *       400:
 *         description: Validation failed or insufficient stock
 */
router.post("/reserve", reserveInventory);

/**
 * @openapi
 * /api/inventory/confirm:
 *   post:
 *     summary: Confirm inventory reservation
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationIds
 *               - orderId
 *             properties:
 *               reservationIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               orderId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventory reservation confirmed
 */
router.post("/confirm", confirmReservation);

/**
 * @openapi
 * /api/inventory/cancel:
 *   post:
 *     summary: Cancel inventory reservation
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationIds
 *             properties:
 *               reservationIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Inventory reservation cancelled
 */
router.post("/cancel", cancelReservation);

/**
 * @openapi
 * /api/inventory/cleanup:
 *   post:
 *     summary: Clean up expired reservations
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Expired reservations cleaned up
 */
router.post("/cleanup", cleanupExpiredReservations);

export default router;
