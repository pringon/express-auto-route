import Server, { LoggerTypes } from './Server';
import {
  RequestHandler,
  ErrorRequestHandler,
} from 'express';

import bodyParser from 'body-parser';

import winston from 'winston';
import expressWinston from 'express-winston';

const getRequestLogger = (): RequestHandler => (
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
    ],
    expressFormat: true,
    meta: false,
  })
);

const getErrorLogger = (): ErrorRequestHandler => (
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
    ],
  })
);

(async () => {
  const app = await Server.getDefault();
  app.use(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  );
  app.setLogger(getRequestLogger(), LoggerTypes.Request);
  app.setLogger(getErrorLogger(), LoggerTypes.Error);
  app.route();
  app.start();
})();
