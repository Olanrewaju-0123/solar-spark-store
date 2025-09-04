import type { Request, Response } from "express";
import { z } from "zod";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Product } from "../models/Product.js";
import { updateOrderSchema, paginationSchema } from "../config/validation.js";
import { createLogger } from "../config/logger.js";

const logger = createLogger("OrdersController");

// Validation schema for cart checkout
const checkoutSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive("Product ID must be positive"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "At least one item is required"),
  paymentMethod: z.enum(["credit_card", "installment_loan", "bank_transfer"]),
  installmentMonths: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

/**
 * Create a new order (checkout)
 * POST /api/orders
 */
export async function createOrder(req: Request, res: Response) {
  const transaction = await sequelize.transaction();

  try {
    logger.info("Creating new order");

    // Validate request body
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn("Invalid order data");
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid request data",
          details: parsed.error.flatten(),
        },
      });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      installmentMonths,
      notes,
    } = parsed.data;

    // Calculate totals and validate stock
    let subtotal = 0;
    const orderItems = [];
    const TAX_RATE = 0.075; // 7.5% tax
    const SHIPPING_COST = 25.0; // Fixed shipping cost

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });

      if (!product) {
        await transaction.rollback();
        logger.warn("Product not found");
        return res.status(400).json({
          success: false,
          error: {
            message: `Product ${item.productId} not found`,
          },
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        logger.warn("Insufficient stock");
        return res.status(400).json({
          success: false,
          error: {
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          },
        });
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: Number(product.price),
      });

      // Update stock
      await product.update(
        {
          stock: product.stock - item.quantity,
        },
        { transaction }
      );
    }

    // Calculate tax, shipping, and total
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_COST;

    // Create order
    const orderData: any = {
      customerName,
      customerEmail,
      shippingAddress,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: SHIPPING_COST,
      total: Number(total.toFixed(2)),
      status: "pending",
      paymentMethod,
    };

    if (customerPhone) orderData.customerPhone = customerPhone;
    if (installmentMonths) orderData.installmentMonths = installmentMonths;
    if (notes) orderData.notes = notes;

    const order = await Order.create(orderData, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          ...item,
        },
        { transaction }
      );
    }

    await transaction.commit();

    logger.info("Order created successfully");

    return res.status(201).json({
      success: true,
      data: {
        id: order.id,
        total: order.total,
        status: order.status,
        message: "Order placed successfully",
      },
      message: "Order created successfully",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Error creating order");
    return res.status(500).json({
      success: false,
      error: {
        message: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Get order details
 * GET /api/orders/:id
 */
export async function getOrder(req: Request, res: Response) {
  try {
    const idParam = (req.params as any)["id"];
    if (!idParam) {
      logger.warn("Missing order ID");
      return res.status(400).json({
        success: false,
        error: {
          message: "Order ID is required",
        },
      });
    }
    const orderId = parseInt(idParam);

    if (isNaN(orderId)) {
      logger.warn("Invalid order ID");
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid order ID",
        },
      });
    }

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "imageUrl"],
            },
          ],
        },
      ],
    });

    if (!order) {
      logger.warn("Order not found");
      return res.status(404).json({
        success: false,
        error: {
          message: "Order not found",
        },
      });
    }

    logger.info("Order retrieved successfully");

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    logger.error("Error getting order");
    return res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * List orders (for admin purposes)
 * GET /api/orders
 */
export async function listOrders(req: Request, res: Response) {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      logger.warn("Invalid pagination parameters");
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid pagination parameters",
          details: parsed.error.flatten(),
        },
      });
    }

    const { page, limit, search, sortBy, sortOrder } = parsed.data;
    const offset = (page - 1) * limit;

    const whereClause: any = {};
    if (search) {
      whereClause[Op.or] = [
        { customerName: { [Op.iLike]: `%${search}%` } },
        { customerEmail: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: orders, count } = await Order.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy || "createdAt", sortOrder || "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "imageUrl"],
            },
          ],
        },
      ],
    });

    logger.info("Orders listed successfully");

    return res.json({
      success: true,
      data: {
        items: orders,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error("Error listing orders");
    return res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

/**
 * Update order status
 * PUT /api/orders/:id
 */
export async function updateOrder(req: Request, res: Response) {
  try {
    const idParam = (req.params as any)["id"];
    if (!idParam) {
      logger.warn("Missing order ID");
      return res.status(400).json({
        success: false,
        error: {
          message: "Order ID is required",
        },
      });
    }
    const orderId = parseInt(idParam);

    if (isNaN(orderId)) {
      logger.warn("Invalid order ID");
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid order ID",
        },
      });
    }

    const parsed = updateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn("Invalid update data");
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid update data",
          details: parsed.error.flatten(),
        },
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      logger.warn("Order not found for update");
      return res.status(404).json({
        success: false,
        error: {
          message: "Order not found",
        },
      });
    }

    // Filter out undefined values before updating
    const updateData = Object.fromEntries(
      Object.entries(parsed.data).filter(([_, value]) => value !== undefined)
    );
    await order.update(updateData);

    logger.info("Order updated successfully");

    return res.json({
      success: true,
      data: order,
      message: "Order updated successfully",
    });
  } catch (error) {
    logger.error("Error updating order");
    return res.status(500).json({
      success: false,
      error: {
        message: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
