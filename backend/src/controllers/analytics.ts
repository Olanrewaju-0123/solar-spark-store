import type { Request, Response } from "express";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { createLogger } from "../config/logger.js";
import { 
  trackEventSchema, 
  analyticsSummaryQuerySchema,
  analyticsEventsQuerySchema 
} from "../validations/analytics.js";

const logger = createLogger("AnalyticsController");

/**
 * Track an analytics event
 * POST /api/analytics/track
 */
export async function trackEvent(req: Request, res: Response) {
  try {
    const parsed = trackEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { eventType, userId, sessionId, productId, orderId, metadata } = parsed.data;

    const event = await AnalyticsEvent.create({
      eventType,
      userId: userId || undefined,
      sessionId: sessionId || undefined,
      productId: productId || undefined,
      orderId: orderId || undefined,
      metadata: metadata || undefined,
      userAgent: req.get("User-Agent") || undefined,
      ipAddress: req.ip || req.connection.remoteAddress || undefined,
    });

    logger.info(`Analytics event tracked: ${eventType}`, { eventId: event.id });

    res.json({
      success: true,
      data: { eventId: event.id },
    });
  } catch (error) {
    logger.error(error, "Failed to track analytics event");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get analytics summary (Admin only)
 * GET /api/analytics/summary
 */
export async function getAnalyticsSummary(req: Request, res: Response) {
  try {
    const parsed = analyticsSummaryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { days } = parsed.data;
    const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    // Get event counts by type
    const eventCounts = await AnalyticsEvent.findAll({
      attributes: [
        'eventType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      group: ['eventType'],
      raw: true,
    });

    // Get unique users and sessions (simplified)
    const uniqueUsers = await AnalyticsEvent.count({
      distinct: true,
      col: 'userId',
      where: {
        createdAt: {
          [Op.gte]: startDate,
        },
      },
    });

    const uniqueSessions = await AnalyticsEvent.count({
      distinct: true,
      col: 'sessionId',
      where: {
        createdAt: {
          [Op.gte]: startDate,
        },
      },
    });

    // Get top products (simplified)
    const topProducts = await AnalyticsEvent.findAll({
      attributes: [
        'productId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'views']
      ],
      where: {
        eventType: 'product_view',
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      group: ['productId'],
      order: [[sequelize.literal('views'), 'DESC']],
      limit: 10,
      raw: true,
    });

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        eventCounts,
        uniqueUsers,
        uniqueSessions,
        topProducts,
      },
    });
  } catch (error) {
    logger.error(error, "Failed to get analytics summary");
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get analytics events (Admin only)
 * GET /api/analytics/events
 */
export async function getAnalyticsEvents(req: Request, res: Response) {
  try {
    const parsed = analyticsEventsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.errors,
      });
    }

    const { page, pageSize, eventType, days } = parsed.data;
    const offset = (Number(page) - 1) * Number(pageSize);
    const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const where: any = {
      createdAt: {
        [Op.gte]: startDate,
      },
    };

    if (eventType) {
      where.eventType = eventType;
    }

    const { count, rows } = await AnalyticsEvent.findAndCountAll({
      where,
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
    logger.error(error, "Failed to get analytics events");
    res.status(500).json({ error: "Internal server error" });
  }
}
