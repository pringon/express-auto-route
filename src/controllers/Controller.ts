export type Route = {
  method: string,
  url: string,
  middlewares: Function[],
  methodName: string,
};

abstract class Controller {
  // @ts-ignore
  protected $routes: Route[];

  public getRoutes(): Route[] {
    if (!this.$routes) {
      throw new RangeError('No routes defined. Did you use routing decorators?');
    }
    return this.$routes;
  }
}

export type ControllerClass = typeof Controller;
export default Controller;
