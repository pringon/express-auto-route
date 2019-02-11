import express from 'express';

import { PORT } from './config';

const app: express.Application = express();

import { helloWorld } from './helloWorld';

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: helloWorld() });
});

app.listen(PORT, (err: Error) => {
  if (err) {
    throw err;
  }
  console.log(`App is listening on port ${PORT}`);
});
