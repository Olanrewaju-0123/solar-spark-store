import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { z } from "zod";
import pino from "pino";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import { errorHandler } from "./utils/error.js";
import { sequelize } from "./db/index.js";

const app = express();
const logger = pino({ transport: { target: "pino-pretty" } });

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// API Routes
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

// Swagger Documentation
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Solar Store API",
      version: "1.0.0",
      description: "API for solar equipment store with installment financing",
    },
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(errorHandler);

const port = process.env["PORT"] || 4000;
const server = createServer(app);

// Start server with database connection (skip during tests)
if (process.env["NODE_ENV"] !== "test") {
  (async () => {
    try {
      await sequelize.authenticate();
      logger.info("Database connection established successfully.");

      await sequelize.sync({ force: false });
      logger.info("Database synchronized.");

      server.listen(port, () => {
        logger.info(`Server listening on port ${port}`);
      });
    } catch (err) {
      logger.error(err, "Failed to start server");
      process.exit(1);
    }
  })();
}

export default app;
