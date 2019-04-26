// Taken from: https://github.com/buunguyen/route-decorators.
const PRE = '$$route_';

const destruct = (args: (string | Function)[]): [string, Function[]] => {
  const hasPath = typeof args[0] === 'string';
  const path = hasPath ? args[0] : '';
  const middlewares = hasPath ? args.slice(1) : args;

  if (middlewares.some(m => typeof m !== 'function')) {
    throw new Error('All middlewares must be functions.');
  }

  return [path as string, middlewares as Function[]];
};

// @route(method, path:optional, ...middleware: optional)
export const route = (method: string, ...args: (string | Function)[]): Function  => {
  const [path, middlewares] = destruct(args);
  return (target: any, name: string) => {
    target[`${PRE}${name}`] = { method, path, middlewares };
  };
};

// @[method](path:optional, ...middleware: optional)
const methods = ['head', 'options', 'get', 'post', 'put', 'patch', 'delete', 'all'];
methods.forEach((method) => {
  exports[method] = route.bind(null, method);
});

// @controller(path: optional, ...middleware: optional)
export const controller = (...args: (string | Function)[]) => {
  const [controllerPath, controllerMiddlewares] = destruct(args);
  return (target: any) => {
    const proto = target.prototype;
    proto.$routes = Object.getOwnPropertyNames(proto)
      .filter(prop => prop.indexOf(PRE) === 0)
      .map((prop) => {
        const { method, path, middlewares: actionMiddlewares } = proto[prop];
        const url = `${controllerPath}${path}`;
        const middlewares = controllerMiddlewares.concat(actionMiddlewares);
        const methodName = prop.substring(PRE.length);
        return { method, url, middlewares, methodName };
      });
  };
};
