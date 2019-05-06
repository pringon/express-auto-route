import Server from './Server';

import bodyParser from 'body-parser';

(async () => {
  const app = await Server.getDefault();
  app.use(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  );
  app.route();
  app.start();
})();
