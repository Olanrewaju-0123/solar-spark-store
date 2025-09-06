import { sequelize } from "../config/database.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { User } from "../models/User.js";
import { DiscountCode } from "../models/DiscountCode.js";
import { InventoryReservation } from "../models/InventoryReservation.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";

// Define associations
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Export models
export { Product, Order, OrderItem, User, DiscountCode, InventoryReservation, AnalyticsEvent };
export { sequelize };

// Test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    return false;
  }
};

// Sync database (for development/testing)
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(`✅ Database synced successfully${force ? " (forced)" : ""}`);
    return true;
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    return false;
  }
};

export default sequelize;
