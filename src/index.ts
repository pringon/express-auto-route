import Server from './Server';

(async () => {
  const app = await Server.getDefault();
  app.route();
  app.start();
})();
