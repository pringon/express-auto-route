import { getControllers } from './controllers';
export default class Router {
  // @ts-ignore
  private controllers: object[];

  constructor(controllers: object[]) {
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

  public route(): void {
    console.log(this.controllers);
  }
}
