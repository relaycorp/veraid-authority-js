import { RawValue } from './RawValue.js';

describe('RawValue', () => {
  describe('serialise', () => {
    test('Value should be returned as is', () => {
      const originalValue = 'test';
      const bodyValue = new RawValue(originalValue);

      const serialisedValue = bodyValue.serialise();

      expect(serialisedValue).toBe(originalValue);
    });
  });
});
