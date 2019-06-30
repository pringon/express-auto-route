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

  /**
   * body:
   *   - greeting {String} greeting to use in message, default: Hello
   *   - name {String} name to use in message, default: world
   * return object:
   *   - message {String} greeting message
   */
  @get('/')
  hello(req: Request, res: Response, next: NextFunction) {
    const greeting = req.body.greeting || 'Hello';
    const name = req.body.name || 'world';
    res.json({ message: `${greeting} ${name}!` });
  }
}

export default ExampleController;
