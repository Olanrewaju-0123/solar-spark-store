import type { Request, Response } from "express";
import { listProducts } from "../../src/controllers/products";

// Mock Product model used by controller
const mockFindAndCountAll = jest.fn();
jest.mock("../../src/models/Product.js", () => ({
  Product: { findAndCountAll: (args: any) => mockFindAndCountAll(args) },
}));

// Pull the mocked Product for assertions if needed
import { Product } from "../../src/models/Product.js";

describe("Products Controller - listProducts pagination", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockFindAndCountAll.mockReset();
  });

  it("uses default pagination when no query provided (page=1, pageSize=12)", async () => {
    mockFindAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    await listProducts(req as Request, res as Response);

    expect(mockFindAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 12, offset: 0 })
    );
    expect(res.json as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 12,
        total: 0,
        totalPages: 0,
      })
    );
  });

  it("handles very large page numbers gracefully (no crash; returns requested page)", async () => {
    req.query = { page: "999", pageSize: "12" } as any;
    mockFindAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    await listProducts(req as Request, res as Response);

    expect(mockFindAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 12, offset: (999 - 1) * 12 })
    );
    expect(res.json as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 999,
        pageSize: 12,
        total: 0,
        totalPages: 0,
      })
    );
  });

  it("applies minPrice/maxPrice filters correctly in where clause", async () => {
    req.query = { minPrice: "1000", maxPrice: "5000" } as any;
    mockFindAndCountAll.mockResolvedValue({ rows: [], count: 0 });

    await listProducts(req as Request, res as Response);

    expect(mockFindAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          price: expect.any(Object),
        }),
      })
    );
  });
});
