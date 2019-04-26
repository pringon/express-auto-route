import { hello } from '../helloWorld';

test('something', () => {
  expect(hello()).toBe('Hello World!');
});
