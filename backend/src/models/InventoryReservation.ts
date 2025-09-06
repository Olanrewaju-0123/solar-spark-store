import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export interface InventoryReservationAttributes {
  id?: number;
  productId: number;
  quantity: number;
  orderId?: number;
  sessionId?: string;
  expiresAt: Date;
  status: "active" | "confirmed" | "expired" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export class InventoryReservation extends Model<InventoryReservationAttributes> implements InventoryReservationAttributes {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public orderId?: number;
  public sessionId?: string;
  public expiresAt!: Date;
  public status!: "active" | "confirmed" | "expired" | "cancelled";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InventoryReservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "confirmed", "expired", "cancelled"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "InventoryReservation",
    tableName: "inventory_reservations",
    timestamps: true,
  }
);
