# Just a basic template I wrote to use express with typescript!

[![CircleCI](https://circleci.com/gh/pringon/express-auto-route/tree/master.svg?style=svg)](https://circleci.com/gh/pringon/express-auto-route/tree/master)

# Usage

## Run in development

- ```docker-compose up```
  - The app will automatically reload when you make changes.

## Generate production build

- ```docker build -t <image-name> .```
  - This will generate a docker image ready to be used on whatever cloud service you want (don't forget the **dot**!).
- ```docker push <image-name>```
  - Pushes the image to the registry so it can be downloaded by other machines. Makes getting the image onto the cloud machine a little easier.

## Testing

- ```npm run test```
  - Will run your test suite.

## Dynamic routing

- The philosophy behind this template is to remove the hassle of routing your controllers, opting instead to make use of decorators to remove this need.
  - All you have to do is create a *.controller.ts file in the controller directory and have the default exported class extend Controller. 
  - You can then make use for those lovely Flask-inspired routing decorators.

```typescript
@controller('/example')
class ExampleController extends Controller {

  @get('/')
  hello(req: Request, res: Response, next: NextFunction) {
    const greeting = req.body.greeting || 'Hello';
    const name = req.body.name || 'world';
    res.json({ message: `${greeting} ${name}!` });
  }
}
```
