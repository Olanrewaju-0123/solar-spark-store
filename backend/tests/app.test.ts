import request from "supertest";

// Mock DB index to avoid running model associations during tests
jest.mock("../src/db/index.js", () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
  },
}));

// Mock sequelize instance used by orders controller (transaction)
jest.mock("../config/database.js", () => ({
  sequelize: {
    transaction: jest.fn(async (fn?: any) => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
    authenticate: jest.fn(),
    sync: jest.fn(),
  },
}));

// Mock Product model before importing the app to avoid real DB calls
jest.mock("../src/models/Product.js", () => ({
  Product: {
    findAndCountAll: jest.fn(async () => ({
      rows: [
        { id: 1, name: "Mock Solar Panel", price: 100000, category: "SOLAR" },
        { id: 2, name: "Mock Inverter", price: 50000, category: "INVERTER" },
      ],
      count: 2,
    })),
    findByPk: jest.fn(async (id: number) => {
      if (id === 1) {
        return {
          id: 1,
          name: "Mock Solar Panel",
          price: 100000,
          category: "SOLAR",
          stock: 10,
          update: jest.fn(),
        };
      }
      return null;
    }),
  },
}));

// Mock Orders models
const mockOrderCreate = jest.fn(async (data: any) => ({ id: 555, ...data }));
jest.mock("../src/models/Order.js", () => ({
  Order: {
    create: (data: any) => mockOrderCreate(data),
    findByPk: jest.fn(async (id: number) =>
      id === 555 ? { id: 555, customerName: "Test Customer" } : null
    ),
  },
}));

jest.mock("../src/models/OrderItem.js", () => ({
  OrderItem: { create: jest.fn(async () => ({})) },
}));

let app: any;
beforeAll(async () => {
  process.env["NODE_ENV"] = "test";
  app = (await import("../src/server")).default;
});

describe("API Endpoints", () => {
  describe("GET /api/products", () => {
    it("should return products list", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body).toHaveProperty("items");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("pageSize");
      expect(response.body).toHaveProperty("totalPages");
    });

    it("should handle pagination", async () => {
      const response = await request(app)
        .get("/api/products?page=1&pageSize=5")
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(5);
    });

    it("should handle search query", async () => {
      const response = await request(app)
        .get("/api/products?q=solar")
        .expect(200);

      expect(response.body).toHaveProperty("items");
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return 404 for non-existent product", async () => {
      await request(app).get("/api/products/999999").expect(404);
    });

    it("should return 400 for invalid product ID", async () => {
      await request(app).get("/api/products/invalid").expect(400);
    });
  });

  describe("POST /api/orders", () => {
    it("should create order with valid data", async () => {
      const orderData = {
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        shippingAddress: {
          street: "123 Test St",
          city: "Lagos",
          state: "LA",
          zipCode: "100001",
          country: "NG",
        },
        items: [{ productId: 1, quantity: 2 }],
        paymentMethod: "credit_card",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.status).toBe("pending");
    });

    it("should return 400 for invalid order data", async () => {
      const invalidOrderData = {
        customerName: "",
        items: [],
      } as any;

      await request(app).post("/api/orders").send(invalidOrderData).expect(400);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return 404 for non-existent order", async () => {
      await request(app).get("/api/orders/999999").expect(404);
    });
  });
});
