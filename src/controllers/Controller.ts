import { IRoute } from '../interfaces/Route';

abstract class Controller {
  // @ts-ignore
  protected $routes: IRoute[];

  public getRoutes(): IRoute[] {
    if (!this.$routes) {
      throw new RangeError('No routes defined. Did you use routing decorators?');
    }
    return this.$routes;
  }
}

export type ControllerClass = typeof Controller;
export default Controller;
