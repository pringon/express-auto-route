import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';
import http from 'http';
import { default as createError, HttpError } from 'http-errors';

import Router from './Router';

import { PORT } from './config';

export default class Server {
  public static readonly PORT: number = 3000;
  private app: Application;
  private server: http.Server;
  private router: Router;
  private port: number | string;
  private running: boolean;

  constructor(router: Router) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.router = router;
    this.port = PORT || Server.PORT;
    this.running = false;
  }

  public static getDefault(): Promise<Server> {
    return new Promise<Server>(async(resolve, reject) => {
      try {
        const router = await Router.getDefault();
        return resolve(new Server(router));
      } catch (e) {
        return reject(e);
      }
    });
  }

  public setPort(port: number | string): void {
    if (this.running) {
      throw new Error('Cannot change port after application has started.');
    }
    this.port = port;
  }

  public route(): void {
    this.router.route(this.app);
    this.handleNotFound();
    this.handleErrors();
  }

  public start(): void {
    this.server.listen(this.port, () => {
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
