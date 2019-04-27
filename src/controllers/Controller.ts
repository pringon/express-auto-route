import { IRoute } from '../interfaces/Route';

abstract class Controller {
  // @ts-ignore
  protected $routes: IRoute[];

  public getRoutes(): IRoute[] {
    if (!this.$routes) {
      throw new Error('Invalid controller. Did you use routing decorators?');
    }
    return this.$routes;
  }
}

export default Controller;
