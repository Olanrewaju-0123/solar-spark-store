import pino from 'pino';
declare const logger: import("pino").Logger<never>;
export declare const createLogger: (context: string) => pino.Logger<never>;
export declare const requestLogger: (req: any, res: any, next: any) => void;
export declare const errorLogger: (error: Error, req?: any) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map