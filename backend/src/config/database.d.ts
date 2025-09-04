import { Sequelize } from "sequelize";
type DbConfig = {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: "postgres";
    logging: any;
    pool: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
    dialectOptions?: any;
};
declare const dbConfig: DbConfig;
export declare const sequelize: Sequelize;
export default dbConfig;
//# sourceMappingURL=database.d.ts.map