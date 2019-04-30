// @ts-ignore
import { controller, get } from '../../decorators/routing';
import { Request, Response, NextFunction } from 'express';
import Controller from '../../controllers/Controller';

class EmptyController extends Controller {}

@controller('/')
class ControllerWithRoute extends Controller {

  @get('/')
  public hello(req: Request, res: Response, next: NextFunction) {
    res.send('Hello');
  }
}

describe('getRoutes on controller with no routes should throw an error', () => {
  const controller = new EmptyController();

  test('should throw InvalidController error', () => {
    expect(() => {
      controller.getRoutes();
    }).toThrow(RangeError);
  });
});

describe('getRoutes on controller with one route should return a single element array', () => {
  const controller = new ControllerWithRoute();
  const routes = controller.getRoutes();

  test('should return an array with a single route', () => {
    expect(routes.length).toBe(1);
  });

  describe('route', () => {
    const route = routes[0];
    test('should be a get method', () => {
      expect(route.method).toBe('get');
    });
    test('should use root path', () => {
      expect(route.url).toBe('/');
    });
    test('should have no middleware', () => {
      expect(route.middlewares.length).toBe(0);
    });
    test('should have correct method name', () => {
      expect(route.methodName).toBe('hello');
    });
  });
});
