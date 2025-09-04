import type { Request, Response } from "express";
import { createOrder } from "../../src/controllers/orders";

// Mock sequelize instance used in controllers
jest.mock("../../config/database.js", () => ({
  sequelize: {
    transaction: jest.fn(async () => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
    authenticate: jest.fn(),
    sync: jest.fn(),
  },
}));

// Mock logger
jest.mock("../../config/logger.js", () => ({
  createLogger: () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() }),
}));

// Mock models used in controllers
jest.mock("../../src/models/Order.js", () => ({
  Order: { create: jest.fn(), findByPk: jest.fn(), findAndCountAll: jest.fn() },
}));

jest.mock("../../src/models/OrderItem.js", () => ({
  OrderItem: { create: jest.fn() },
}));

jest.mock("../../src/models/Product.js", () => ({
  Product: { findByPk: jest.fn(), update: jest.fn() },
}));

// Pull mocked implementations for convenience
import { Order } from "../../src/models/Order.js";
import { OrderItem } from "../../src/models/OrderItem.js";
import { Product } from "../../src/models/Product.js";
import { sequelize } from "../../config/database.js";

describe("Orders Controller - createOrder", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  it("creates order and calculates totals", async () => {
    const validOrderData = {
      customerName: "John Doe",
      customerEmail: "john@example.com",
      shippingAddress: {
        street: "123 Main St",
        city: "Lagos",
        state: "LA",
        zipCode: "100001",
        country: "NG",
      },
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      paymentMethod: "credit_card",
    };

    (Product.findByPk as jest.Mock).mockImplementation((id: number) => {
      if (id === 1)
        return Promise.resolve({
          id: 1,
          name: "Solar Panel",
          price: 100000,
          stock: 10,
          update: jest.fn(),
        });
      if (id === 2)
        return Promise.resolve({
          id: 2,
          name: "Inverter",
          price: 50000,
          stock: 5,
          update: jest.fn(),
        });
      return Promise.resolve(null);
    });

    (Order.create as jest.Mock).mockResolvedValue({
      id: 123,
      total: 268750,
      status: "pending",
    });
    (OrderItem.create as jest.Mock).mockResolvedValue({});

    mockRequest.body = validOrderData;

    await createOrder(mockRequest as Request, mockResponse as Response);

    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotal: 250000,
        tax: expect.any(Number),
        total: expect.any(Number),
        status: "pending",
      }),
      expect.any(Object)
    );

    expect(mockResponse.status as jest.Mock).toHaveBeenCalledWith(201);
    expect(mockResponse.json as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ id: 123, status: "pending" }),
      })
    );
  });

  it("fails when product stock is insufficient", async () => {
    const data = {
      customerName: "John Doe",
      customerEmail: "john@example.com",
      shippingAddress: {
        street: "1",
        city: "c",
        state: "s",
        zipCode: "z",
        country: "NG",
      },
      items: [{ productId: 1, quantity: 999 }],
      paymentMethod: "credit_card",
    };

    (Product.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Solar Panel",
      price: 100000,
      stock: 1,
      update: jest.fn(),
    });

    mockRequest.body = data;
    await createOrder(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status as jest.Mock).toHaveBeenCalledWith(400);
    expect(mockResponse.json as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: expect.any(Object) })
    );
  });

  it("returns 400 for invalid payload with missing address fields", async () => {
    const invalidData = {
      customerName: "John Doe",
      customerEmail: "john@example.com",
      shippingAddress: {
        street: "", // invalid
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      items: [{ productId: 1, quantity: 1 }],
      paymentMethod: "credit_card",
    };

    // Product exists so validation reaches zod schema checks
    (Product.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Solar Panel",
      price: 100000,
      stock: 10,
      update: jest.fn(),
    });

    mockRequest.body = invalidData;
    await createOrder(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status as jest.Mock).toHaveBeenCalledWith(400);
    expect(mockResponse.json as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: expect.any(Object) })
    );
  });
});
