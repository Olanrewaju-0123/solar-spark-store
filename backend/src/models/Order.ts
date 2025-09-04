import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../config/database.js";

// Interface for Order attributes
export interface OrderAttributes {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "credit_card" | "installment_loan" | "bank_transfer";
  installmentMonths?: number;
  trackingNumber?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Order creation
interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    "id" | "status" | "trackingNumber" | "createdAt" | "updatedAt"
  > {}

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public customerName!: string;
  public customerEmail!: string;
  public customerPhone?: string;
  public shippingAddress!: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  public total!: number;
  public subtotal!: number;
  public tax!: number;
  public shipping!: number;
  public status!:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  public paymentMethod!: "credit_card" | "installment_loan" | "bank_transfer";
  public installmentMonths?: number;
  public trackingNumber?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidAddress(value: any) {
          if (!value || typeof value !== "object") {
            throw new Error("Shipping address must be an object");
          }
          const required = ["street", "city", "state", "zipCode", "country"];
          for (const field of required) {
            if (!value[field] || typeof value[field] !== "string") {
              throw new Error(
                `Shipping address ${field} is required and must be a string`
              );
            }
          }
        },
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    shipping: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("credit_card", "installment_loan", "bank_transfer"),
      allowNull: false,
    },
    installmentMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 60,
      },
    },
    trackingNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["customerEmail"],
      },
      {
        fields: ["paymentMethod"],
      },
    ],
  }
);

export default Order;
