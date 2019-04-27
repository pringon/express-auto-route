import {
  Request,
  Response,
  NextFunction,
} from 'express';
import Controller from './Controller';
// @ts-ignore
import { controller, get } from '../decorators/routing';

@controller('/example')
class ExampleController extends Controller {

  @get('/')
  hello(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Hello world!' });
  }
}

export default ExampleController;
