import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const env = process.env["NODE_ENV"] || "development";
const config = {
    development: {
        username: process.env["DB_USER"] || "postgres",
        password: process.env["DB_PASSWORD"] || "password",
        database: process.env["DB_NAME"] || "solar_store_dev",
        host: process.env["DB_HOST"] || "localhost",
        port: parseInt(process.env["DB_PORT"] || "5432"),
        dialect: "postgres",
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    test: {
        username: process.env["DB_USER"] || "postgres",
        password: process.env["DB_PASSWORD"] || "password",
        database: process.env["DB_NAME"] || "solar_store_test",
        host: process.env["DB_HOST"] || "localhost",
        port: parseInt(process.env["DB_PORT"] || "5432"),
        dialect: "postgres",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    production: {
        username: process.env["DB_USER"] || "",
        password: process.env["DB_PASSWORD"] || "",
        database: process.env["DB_NAME"] || "",
        host: process.env["DB_HOST"] || "",
        port: parseInt(process.env["DB_PORT"] || "5432"),
        dialect: "postgres",
        logging: false,
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
const dbConfig = (config[env] ||
    config["development"]);
export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
});
export default dbConfig;
//# sourceMappingURL=database.js.map