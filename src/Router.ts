import { getControllers } from './controllers';

export abstract class RouterFactory {

  public static getRouter(): Promise<Router> {
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
}

export class Router {
  // @ts-ignore
  private controllers: object[];

  constructor(controllers: object[]) {
    this.controllers = controllers;
  }

  public route(): void {
    console.log(this.controllers);
  }
}
