import type { Request, Response } from "express";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { Product } from "../models/Product.js";
import { InventoryReservation } from "../models/InventoryReservation.js";
import { createLogger } from "../config/logger.js";
import { 
  reserveInventorySchema,
  confirmReservationSchema,
  cancelReservationSchema 
} from "../validations/inventory.js";

const logger = createLogger("InventoryController");

/**
 * Reserve inventory for checkout
 * POST /api/inventory/reserve
 */
export async function reserveInventory(req: Request, res: Response) {
  const transaction = await sequelize.transaction();

  try {
    const parsed = reserveInventorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { items, sessionId, reservationMinutes } = parsed.data;
    const expiresAt = new Date(Date.now() + reservationMinutes * 60 * 1000);

    // Check availability and reserve inventory
    const reservations = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      // Calculate currently reserved quantity
      const reservedQuantity = await InventoryReservation.sum("quantity", {
        where: {
          productId: item.productId,
          status: "active",
          expiresAt: { [Op.gt]: new Date() },
        },
        transaction,
      }) || 0;

      const availableQuantity = product.stock - reservedQuantity;
      
      if (availableQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}. Available: ${availableQuantity}, Requested: ${item.quantity}`,
        });
      }

      // Create reservation
      const reservation = await InventoryReservation.create({
        productId: item.productId,
        quantity: item.quantity,
        ...(sessionId !== undefined && { sessionId }),
        expiresAt,
        status: "active",
      }, { transaction });

      reservations.push(reservation);
    }

    await transaction.commit();

    logger.info(`Inventory reserved for ${items.length} items`);

    res.json({
      success: true,
      data: {
        reservations: reservations.map(r => ({
          id: r.id,
          productId: r.productId,
          quantity: r.quantity,
          expiresAt: r.expiresAt,
        })),
        expiresAt,
      },
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(error, "Failed to reserve inventory");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Confirm inventory reservation (when order is placed)
 * POST /api/inventory/confirm
 */
export async function confirmReservation(req: Request, res: Response) {
  const transaction = await sequelize.transaction();

  try {
    const parsed = confirmReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { reservationIds, orderId } = parsed.data;

    if (!Array.isArray(reservationIds) || reservationIds.length === 0) {
      return res.status(400).json({ error: "Reservation IDs required" });
    }

    // Update reservations to confirmed status
    await InventoryReservation.update(
      { status: "confirmed", orderId },
      {
        where: {
          id: { [Op.in]: reservationIds },
          status: "active",
          expiresAt: { [Op.gt]: new Date() },
        },
        transaction,
      }
    );

    // Update product stock
    const reservations = await InventoryReservation.findAll({
      where: { id: { [Op.in]: reservationIds } },
      transaction,
    });

    for (const reservation of reservations) {
      await Product.decrement("stock", {
        by: reservation.quantity,
        where: { id: reservation.productId },
        transaction,
      });
    }

    await transaction.commit();

    logger.info(`Inventory confirmed for order ${orderId}`);

    res.json({
      success: true,
      message: "Inventory reservation confirmed",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(error, "Failed to confirm inventory reservation");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Cancel inventory reservation
 * POST /api/inventory/cancel
 */
export async function cancelReservation(req: Request, res: Response) {
  try {
    const parsed = cancelReservationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { reservationIds } = parsed.data;

    if (!Array.isArray(reservationIds) || reservationIds.length === 0) {
      return res.status(400).json({ error: "Reservation IDs required" });
    }

    await InventoryReservation.update(
      { status: "cancelled" },
      {
        where: {
          id: { [Op.in]: reservationIds },
          status: "active",
        },
      }
    );

    logger.info(`Inventory reservation cancelled for ${reservationIds.length} items`);

    res.json({
      success: true,
      message: "Inventory reservation cancelled",
    });
  } catch (error) {
    logger.error(error, "Failed to cancel inventory reservation");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Clean up expired reservations (should be called periodically)
 * POST /api/inventory/cleanup
 */
export async function cleanupExpiredReservations(req: Request, res: Response) {
  try {
    const result = await InventoryReservation.update(
      { status: "expired" },
      {
        where: {
          status: "active",
          expiresAt: { [Op.lt]: new Date() },
        },
      }
    );

    logger.info(`Cleaned up ${result[0]} expired reservations`);

    res.json({
      success: true,
      message: `Cleaned up ${result[0]} expired reservations`,
    });
  } catch (error) {
    logger.error(error, "Failed to cleanup expired reservations");
    res.status(500).json({ error: "Internal server error" });
  }
}
