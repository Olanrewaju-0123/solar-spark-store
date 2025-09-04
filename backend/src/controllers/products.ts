import type { Request, Response } from "express";
import { Op, fn, col } from "sequelize";
import { Product } from "../models/Product.js";

/**
 * List products with pagination, search, and filtering
 * GET /api/products
 */
export async function listProducts(req: Request, res: Response) {
  try {
    const pageNum = Number((req.query as any)["page"] ?? "1");
    const limit = Number((req.query as any)["pageSize"] ?? "12");
    const offset = (pageNum - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};

    const q = (req.query as any)["q"] ? String((req.query as any)["q"]) : "";
    if (q) {
      whereClause.name = {
        [Op.iLike]: `%${q}%`,
      };
    }

    const category = (req.query as any)["category"]
      ? String((req.query as any)["category"])
      : undefined;
    if (category) {
      whereClause.category = category;
    }

    const minPrice = (req.query as any)["minPrice"]
      ? Number((req.query as any)["minPrice"])
      : undefined;
    const maxPrice = (req.query as any)["maxPrice"]
      ? Number((req.query as any)["maxPrice"])
      : undefined;
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price[Op.gte] = minPrice;
      if (maxPrice !== undefined) whereClause.price[Op.lte] = maxPrice;
    }

    // Validate sort parameters
    const validSortFields = ["name", "price", "category", "createdAt"];
    const validSortOrders = ["ASC", "DESC"];

    const sortByParam = String((req.query as any)["sortBy"] ?? "name");
    const sortOrderParam = String(
      (req.query as any)["sortOrder"] ?? "ASC"
    ).toUpperCase();
    const sortField = validSortFields.includes(sortByParam)
      ? sortByParam
      : "name";
    const sortOrderValid = validSortOrders.includes(sortOrderParam)
      ? sortOrderParam
      : "ASC";

    const { rows: products, count } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [
        [
          sortField,
          (sortOrderValid === "DESC" ? "DESC" : "ASC") as "ASC" | "DESC",
        ],
      ],
    });

    return res.json({
      items: products,
      total: count,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({
      error: {
        message: "Failed to fetch products",
      },
    });
  }
}

/**
 * Get a single product by ID
 * GET /api/products/:id
 */
export async function getProduct(req: Request, res: Response) {
  try {
    const idParam = (req.params as any)["id"];
    if (!idParam) {
      return res.status(400).json({
        error: { message: "Invalid product ID" },
      });
    }
    const productId = parseInt(idParam);

    if (isNaN(productId)) {
      return res.status(400).json({
        error: {
          message: "Invalid product ID",
        },
      });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        error: {
          message: "Product not found",
        },
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    return res.status(500).json({
      error: {
        message: "Failed to fetch product",
      },
    });
  }
}

/**
 * Get product categories
 * GET /api/products/categories
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await Product.findAll({
      attributes: [[fn("DISTINCT", col("category")), "category"]],
      raw: true,
    });

    const categoryList = categories.map((cat) => cat.category).filter(Boolean);

    return res.json({ categories: categoryList });
  } catch (error) {
    console.error("Error getting categories:", error);
    return res.status(500).json({
      error: {
        message: "Failed to fetch categories",
      },
    });
  }
}
