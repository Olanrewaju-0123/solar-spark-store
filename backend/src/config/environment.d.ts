export declare const env: {
    NODE_ENV: "development" | "test" | "production";
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: string;
    PORT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX_REQUESTS: string;
    CORS_ORIGIN: string;
    LOG_LEVEL: "warn" | "error" | "fatal" | "info" | "debug" | "trace";
    API_PREFIX: string;
    HELMET_ENABLED: boolean;
    SWAGGER_ENABLED: boolean;
    SWAGGER_TITLE: string;
    SWAGGER_VERSION: string;
    SWAGGER_DESCRIPTION: string;
};
export declare const config: {
    app: {
        env: "development" | "test" | "production";
        port: number;
        apiPrefix: string;
        isDevelopment: boolean;
        isTest: boolean;
        isProduction: boolean;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    cors: {
        origin: string;
    };
    logging: {
        level: "warn" | "error" | "fatal" | "info" | "debug" | "trace";
    };
    security: {
        helmetEnabled: boolean;
    };
    swagger: {
        enabled: boolean;
        title: string;
        version: string;
        description: string;
    };
};
export default config;
//# sourceMappingURL=environment.d.ts.map