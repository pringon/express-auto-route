import ExampleController from '../../controllers/Example.controller';
// tslint:disable-next-line:import-name
import httpMocks from 'node-mocks-http';

describe('Should instantiate', () => {
  const controller = new ExampleController();

  test('Should get correct routes', () => {
    const routes = controller.getRoutes();
    expect(routes).toEqual([{
      method: 'get',
      url: '/example/',
      middlewares: [],
      methodName: 'hello',
    }]);
  });

  test('Should get correct result from method', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/example/',
    });
    const response = httpMocks.createResponse();
    const next = () => {};
    controller.hello(request, response, next);
    const data = JSON.parse(response._getData());
    expect(data).toEqual({ message: 'Hello world!' });
  });
});
