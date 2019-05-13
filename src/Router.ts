import { Application } from 'express';
import { getControllers } from './controllers';
import { ControllerClass, Route } from './controllers/Controller';

export default class Router {
  private controllers: ControllerClass[];

  constructor(controllers: ControllerClass[]) {
    this.controllers = controllers;
  }

  public static getDefault(): Promise<Router> {
    return new Promise<Router>(async (resolve, reject) => {
      try {
        const controllers = await getControllers();
        const router = new Router(controllers);
        return resolve(router);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public static getEmptyRouter(): Router {
    return new Router([]);
  }

  public route(app: Application): void {
    if (this.controllers.length <= 0) {
      throw RangeError('No controller associated with this router.');
    }
    this.controllers.forEach((controller) => {
      // @ts-ignore
      const instance = new controller();
      instance.getRoutes().forEach((route: Route) => {
        const { methodName, method, url, middlewares } = route;
        // @ts-ignore
        app[method](url, middlewares, instance[methodName]);
      });
    });
  }
}
