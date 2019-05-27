import Server, { LoggerTypes } from './Server';

import { requestLogger, errorLogger } from './lib/logger';
import bodyParser from 'body-parser';

(async () => {
  const app = await Server.getDefault();
  app.use(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  );
  app.addLogger(requestLogger, LoggerTypes.Request);
  app.addLogger(errorLogger, LoggerTypes.Error);
  app.route();
  app.start();
})();
