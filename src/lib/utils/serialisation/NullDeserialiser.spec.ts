import { NullDeserialiser } from './NullDeserialiser.js';

describe('NullDeserialiser', () => {
  describe('deserialise', () => {
    test('Null should be returned', async () => {
      const deserialiser = new NullDeserialiser();

      const value = await deserialiser.deserialise();

      expect(value).toBeNull();
    });
  });
});
