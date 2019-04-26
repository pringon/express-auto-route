import { ServerFactory } from './Server';

(async () => {
  const app = await ServerFactory.getServer();
  app.route();
  app.start();
})();
