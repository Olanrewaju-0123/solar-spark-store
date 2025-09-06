import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export interface AnalyticsEventAttributes {
  id?: number;
  eventType: "page_view" | "add_to_cart" | "remove_from_cart" | "checkout_start" | "checkout_complete" | "product_view";
  userId?: number;
  sessionId?: string;
  productId?: number;
  orderId?: number;
  metadata?: any;
  userAgent?: string;
  ipAddress?: string;
  createdAt?: Date;
}

export class AnalyticsEvent extends Model<AnalyticsEventAttributes> implements AnalyticsEventAttributes {
  public id!: number;
  public eventType!: "page_view" | "add_to_cart" | "remove_from_cart" | "checkout_start" | "checkout_complete" | "product_view";
  public userId?: number;
  public sessionId?: string;
  public productId?: number;
  public orderId?: number;
  public metadata?: any;
  public userAgent?: string;
  public ipAddress?: string;
  public readonly createdAt!: Date;
}

AnalyticsEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventType: {
      type: DataTypes.ENUM("page_view", "add_to_cart", "remove_from_cart", "checkout_start", "checkout_complete", "product_view"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AnalyticsEvent",
    tableName: "analytics_events",
    timestamps: true,
    updatedAt: false, // We only care about when events are created
  }
);
