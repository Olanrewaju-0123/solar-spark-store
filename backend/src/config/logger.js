import pino from 'pino';
import { config } from './environment.js';
const transport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
    }
});
const logger = pino({
    level: config.logging.level,
    base: {
        env: config.app.env,
        timestamp: pino.stdTimeFunctions.isoTime
    },
    formatters: {
        level: (label) => {
            return { level: label };
        },
        log: (object) => {
            return object;
        }
    }
}, transport);
export const createLogger = (context) => {
    return logger.child({ context });
};
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress
        };
        if (res.statusCode >= 400) {
            logger.warn(logData, 'Request completed with warning/error');
        }
        else {
            logger.info(logData, 'Request completed successfully');
        }
    });
    next();
};
export const errorLogger = (error, req) => {
    const errorData = {
        message: error.message,
        stack: error.stack,
        url: req?.url,
        method: req?.method,
        ip: req?.ip || req?.connection?.remoteAddress
    };
    logger.error(errorData, 'Application error occurred');
};
export default logger;
//# sourceMappingURL=logger.js.map