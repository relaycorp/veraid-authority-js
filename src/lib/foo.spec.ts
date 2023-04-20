import { foo } from './foo.js';

describe('foo', () => {
  test('foo', () => {
    expect(foo()).toBe('foo');
  });
});
