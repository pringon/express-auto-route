import winston from 'winston';
import expressWinston from 'express-winston';

export const requestLogger = expressWinston
  .logger({
    transports: [
      new winston.transports.Console(),
    ],
    expressFormat: true,
    meta: false,
  });

export const errorLogger = expressWinston
  .errorLogger({
    transports: [
      new winston.transports.Console(),
    ],
  });
