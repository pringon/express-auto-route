import { IRoute } from '../interfaces/Route';

abstract class Controller {
  // @ts-ignore
  protected $routes: IRoute[];

  public getRoutes(): IRoute[] {
    return this.$routes;
  }
}

export default Controller;
