import Controller from './controllers/Controller';
import { IRoute } from './interfaces/Route';
import { Application } from 'express';
import { getControllers } from './controllers';

export default class Router {
  // @ts-ignore
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
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

  public route(app: Application): void {
    this.controllers.forEach((controller) => {
      // @ts-ignore
      const instance = new controller();
      instance.getRoutes().forEach((route: IRoute) => {
        const middlewares = route.middlewares || [];
        // @ts-ignore
        app[route.method](route.url, ...middlewares, instance[route.methodName]);
      });
    });
  }
}
