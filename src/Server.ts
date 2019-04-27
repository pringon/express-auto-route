import express, {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import http from 'http';
import { default as createError, HttpError } from 'http-errors';

import Router from './Router';

import { PORT } from './config';

interface IRouteOptions {
  notFoundCallback?: RequestHandler;
  errorHandler?: ErrorRequestHandler;
}

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

  /**
   * A static method that returs a server using the default router provided by this project.
   * @returns {Promise<Server>} promise resolves to an instance of the server class.
   */
  public static getDefault(): Promise<Server> {
    return new Promise<Server>(async(resolve, reject) => {
      try {
        const router = await Router.getDefault();
        const server = new Server(router);
        return resolve(server);
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

  public route({
    notFoundCallback = this.notFound,
    errorHandler = this.errorHandler,
  }: IRouteOptions = {}): void {
    this.router.route(this.app);
    this.app.use(notFoundCallback);
    this.app.use(errorHandler);
  }

  public start(): void {
    this.server.listen(this.port, () => {
      this.running = true;
      // tslint:disable-next-line:no-console
      console.log(`Server is listening on port ${this.port}.`);
    });
  }

  private notFound(req: Request, res: Response, next: NextFunction): void {
    return next(createError(404, 'Resource not found'));
  }

  private errorHandler(
    err: Error | HttpError, req: Request, res: Response, next: NextFunction,
  ): void {
    // @ts-ignore
    return res.status(err.status || 500).send(err.message);
  }
}
