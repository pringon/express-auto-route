import { IRoute } from '../interfaces/Route';

class Controller {
  // @ts-ignore
  protected $routes: IRoute[];

  public getRoutes(): IRoute[] {
    if (this.constructor.name === 'Controller') {
      throw new Error('Passing base controller class to router is strictly prohibited.');
    }
    if (!this.$routes) {
      throw new Error('Invalid controller. Did you use routing decorators?');
    }
    return this.$routes;
  }
}

export default Controller;
