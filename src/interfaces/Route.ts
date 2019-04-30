export interface IRoute {
  method: string;
  url: string;
  middlewares: Function[];
  methodName: string;
}
