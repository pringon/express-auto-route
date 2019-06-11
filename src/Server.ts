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

type LoggerHandler = RequestHandler | ErrorRequestHandler;

type Logger = {
  handler: LoggerHandler,
  type: LoggerTypes,
};

export default class Server {
  public static readonly PORT: number = 3000;
  private app: Application;
  private server: http.Server;
  private router: Router;
  private middleware: RequestHandler[];
  private loggers: Logger[];
  private port: number | string;
  private running: boolean;

  constructor(router: Router = Router.getEmptyRouter()) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.router = router;
    this.middleware = [];
    this.loggers = [];
    this.port = config.get('PORT') || Server.PORT;
    this.running = false;
  }

  /**
   * Method that takes a list of middleware and adds it to the current middleware array.
   * @param {RequestHandler[]} middleware collects all arguments into a single array.
   */
  public use(...middleware: RequestHandler[]): void {
    this.middleware.push(...middleware);
  }

  private getLoggers(type: LoggerTypes): LoggerHandler[] {
    return this.loggers
      .filter(logger => logger.type === type)
      .map(logger => logger.handler);
  }

  /**
   * Method that adds a logger middleware to the list of loggers.
   * @param {Logger} handler logger middleware to be used.
   * @param {LoggerTypes} type type of logger (error or request).
   */
  public addLogger(handler: LoggerHandler, type: LoggerTypes) {
    this.checkRunning();
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

  /**
   * Method that allows setting a different port that the one in configuration.
   * @param {number | string} port value to assign to port.
   */
  public setPort(port: number | string): void {
    this.checkRunning();
    this.port = port;
  }

  /**
   * Methods that stops the client from doing dumb **** while the app is running.
   */
  private checkRunning(): void {
    if (this.running) {
      throw new Error('Server is already running.');
    }
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

  /**
   * Method that routes your application.
   * @param {IRouteOptions} options object containing options to customise the routing.
   */
  private route({
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

  private listen(): void {
    this.server.listen(this.port, () => {
      this.running = true;
      if (config.get('NODE_ENV') === 'development') {
        // tslint:disable-next-line:no-console
        console.log(`Server is listening on port ${this.port}.`);
      }
    });
  }

  /**
   * Method that starts your app and listens on the port specified in config file (or 3000).
   */
  public start(): void {
    this.checkRunning();
    this.route();
    this.listen();
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
