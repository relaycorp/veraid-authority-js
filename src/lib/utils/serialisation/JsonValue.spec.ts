import { JsonValue } from './JsonValue.js';

describe('JsonValue', () => {
  describe('serialise', () => {
    test('Value should be JSON-serialised', () => {
      const originalValue = { foo: 1 };
      const jsonValue = new JsonValue(originalValue);

      const serialisedValue = jsonValue.serialise();

      expect(serialisedValue).toBe(JSON.stringify(originalValue));
    });
  });
});
