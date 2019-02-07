import express from 'express';

const app: express.Application = express();

import { helloWorld } from './helloWorld';

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: helloWorld() });
});

app.listen(3000, (err: Error) => {
  if (err) {
    throw err;
  }
});
