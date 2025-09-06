import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export interface DiscountCodeAttributes {
  id?: number;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number; // percentage (0-100) or fixed amount
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DiscountCode
  extends Model<DiscountCodeAttributes>
  implements DiscountCodeAttributes
{
  public id!: number;
  public code!: string;
  public description!: string;
  public type!: "percentage" | "fixed";
  public value!: number;
  public minOrderAmount?: number;
  public maxDiscountAmount?: number;
  public usageLimit?: number;
  public usedCount!: number;
  public isActive!: boolean;
  public validFrom!: Date;
  public validUntil!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public calculateDiscount(orderAmount: number): number {
    if (!this.isActive || this.usedCount >= (this.usageLimit || Infinity)) {
      return 0;
    }

    const now = new Date();
    if (now < this.validFrom || now > this.validUntil) {
      return 0;
    }

    if (this.minOrderAmount && orderAmount < this.minOrderAmount) {
      return 0;
    }

    let discount = 0;
    if (this.type === "percentage") {
      discount = (orderAmount * this.value) / 100;
    } else {
      discount = this.value;
    }

    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }

    return Math.min(discount, orderAmount);
  }
}

DiscountCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DiscountCode",
    tableName: "discount_codes",
    timestamps: true,
  }
);
