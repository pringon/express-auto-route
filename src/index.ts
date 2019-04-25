import express, {
  Request,
  Response,
  NextFunction,
} from 'express';
import { default as createError, HttpError } from 'http-errors';

import { PORT } from './config';

const app: express.Application = express();

import { helloWorld } from './helloWorld';

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: helloWorld() });
});

// Handle not found.
app.use((req, res, next) => {
  return next(createError(404, 'Resource not found'));
});

// Handle errors.
app.use((err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  res.status(err.status || 500).send(err.message);
});

app.listen(PORT, (err: Error) => {
  if (err) {
    throw err;
  }
  // tslint:disable-next-line:no-console
  console.log(`App is listening on port ${PORT}`);
});
