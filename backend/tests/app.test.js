import request from "supertest";
import app from "../src/server.js";
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
                items: [{ productId: 1, quantity: 2 }],
                customerEmail: "test@example.com",
                taxRate: 0.075,
            };
            const response = await request(app)
                .post("/api/orders")
                .send(orderData)
                .expect(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body).toHaveProperty("total");
            expect(response.body).toHaveProperty("status");
            expect(response.body.status).toBe("placed");
        });
        it("should return 400 for invalid order data", async () => {
            const invalidOrderData = {
                items: [],
            };
            await request(app).post("/api/orders").send(invalidOrderData).expect(400);
        });
    });
    describe("GET /api/orders/:id", () => {
        it("should return 404 for non-existent order", async () => {
            await request(app).get("/api/orders/999999").expect(404);
        });
    });
});
//# sourceMappingURL=app.test.js.map