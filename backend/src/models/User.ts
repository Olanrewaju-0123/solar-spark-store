import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  role: "admin" | "customer";
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: "admin" | "customer";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);
