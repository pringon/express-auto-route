import config from './config';

if (config.get('NODE_ENV') === 'development') {
  require('source-map-support').install();
}

import Server, { LoggerTypes } from './Server';

import { requestLogger, errorLogger } from './lib/logger';
import bodyParser from 'body-parser';

(async () => {
  const app = await Server.getDefault();
  app.use(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  );
  app.setLogger(requestLogger, LoggerTypes.Request);
  app.setLogger(errorLogger, LoggerTypes.Error);
  app.route();
  app.start();
})();
