import express, {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import http from 'http';

import HttpError from './errors/HttpError';

import Router from './Router';

import config from './config';

interface IRouteOptions {
  notFoundCallback?: RequestHandler;
  errorHandler?: ErrorRequestHandler;
}

export enum LoggerTypes { Request, Error }

type Logger = RequestHandler | ErrorRequestHandler;

interface ILogger {
  handler: Logger;
  type: LoggerTypes;
}

export default class Server {
  public static readonly PORT: number = 3000;
  private app: Application;
  private server: http.Server;
  private router: Router;
  private middleware: RequestHandler[];
  private loggers: ILogger[];
  private port: number | string;
  private running: boolean;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.router = Router.getEmptyRouter();
    this.middleware = [];
    this.loggers = [];
    this.port = config.get('PORT') || Server.PORT;
    this.running = false;
  }

  public use(...middleware: RequestHandler[]): void {
    this.middleware.push(...middleware);
  }

  private getLoggers(type: LoggerTypes): Logger[] {
    return this.loggers
      .filter(logger => logger.type === type)
      .map(logger => logger.handler);
  }

  public setLogger(handler: Logger, type: LoggerTypes) {
    this.loggers.push({
      handler,
      type,
    });
  }

  /**
   * Getter method for app property.
   * @returns {express.Application} express application instance used in this server instance.
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Getter method for server property.
   * @returns {http.Server} http server instance used in this server instance.
   */
  public getServer(): http.Server {
    return this.server;
  }

  public setRouter(router: Router): void {
    if (this.running) {
      throw Error('Cannot change router after application has started');
    }
    this.router = router;
  }

  public setPort(port: number | string): void {
    if (this.running) {
      throw Error('Cannot change port after application has started.');
    }
    this.port = port;
  }

  /**
   * A static method that returs a server using the default router provided by this project.
   * @returns {Promise<Server>} promise resolves to an instance of the server class.
   */
  public static getDefault(): Promise<Server> {
    return new Promise<Server>(async(resolve, reject) => {
      try {
        const router = await Router.getDefault();
        const server = new Server();
        server.setRouter(router);
        return resolve(server);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public route({
    notFoundCallback = this.notFound,
    errorHandler = this.errorHandler,
  }: IRouteOptions = {}): void {
    // Use request loggers.
    const requestLoggers = this.getLoggers(LoggerTypes.Request);
    this.app.use(requestLoggers);
    // Use middleware.
    this.app.use(this.middleware);
    // Route endpoints.
    this.router.route(this.app);
    // Use error loggers.
    const errorLoggers = this.getLoggers(LoggerTypes.Error);
    this.app.use(errorLoggers);
    this.app.use(notFoundCallback);
    this.app.use(errorHandler);
  }

  public start(): void {
    this.server.listen(this.port, () => {
      this.running = true;
      if (config.get('NODE_ENV') === 'development') {
        // tslint:disable-next-line:no-console
        console.log(`Server is listening on port ${this.port}.`);
      }
    });
  }

  private notFound(req: Request, res: Response, next: NextFunction): void {
    return next(new HttpError(404, 'Resource not found'));
  }

  private errorHandler(
    err: Error | HttpError, req: Request, res: Response, next: NextFunction,
  ): void {
    // @ts-ignore
    return res.status(err.status || 500).send(err.message);
  }
}
