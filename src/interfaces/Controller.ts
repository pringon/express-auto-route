export interface IRoute {
  method: string;
  url: string;
  middlewares?: Function[];
  methodName: string;
}

export interface IController {
  $routes: IRoute[];
}
