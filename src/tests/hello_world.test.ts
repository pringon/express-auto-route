import { helloWorld } from "../helloWorld";

test('something', () => {
  expect(helloWorld()).toBe('Hello World!');
});
