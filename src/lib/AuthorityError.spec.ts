import { AuthorityError } from './AuthorityError.js';

describe('AuthorityError', () => {
  test('Name should be that of subclass', () => {
    class SubError extends AuthorityError {}
    const error = new SubError('foo');

    expect(error.name).toBe(SubError.name);
  });
});
