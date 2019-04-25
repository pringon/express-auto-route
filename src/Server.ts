import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';
import http from 'http';
import { default as createError, HttpError } from 'http-errors';

import { PORT } from './config';

import { helloWorld } from './helloWorld';

class Server {
  public static readonly PORT: number = 3000;
  private app: Application;
  private server: http.Server;
  private port: number | string;
  private running: boolean;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = PORT || Server.PORT;
    this.running = false;
  }

  public setPort(port: number | string): void {
    if (this.running) {
      throw new Error('Cannot change port after application has started.');
    }
    this.port = port;
  }

  public route(): void {
    // Insert routes here.
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.json({ message: helloWorld() });
    });

    this.handleNotFound();
    this.handleErrors();
  }

  public start(): void {
    this.server.listen(this.port, (err: Error) => {
      if (err) {
        throw err;
      }
      this.running = true;
      // tslint:disable-next-line:no-console
      console.log(`Server is listening on port ${this.port}.`);
    });
  }

  private handleNotFound(): void {
    this.app.use((req, res, next) => {
      return next(createError(404, 'Resource not found'));
    });
  }

  private handleErrors(): void {
    this.app.use((err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      res.status(err.status || 500).send(err.message);
    });
  }
}

export default Server;
