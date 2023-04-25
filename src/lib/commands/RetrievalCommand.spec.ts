import { NullDeserialiser } from '../utils/serialisation/NullDeserialiser.js';

import { RetrievalCommand } from './RetrievalCommand.js';

class StubRetrievalCommand extends RetrievalCommand<null, null> {
  public responseDeserialiser = new NullDeserialiser();

  public getOutput(): null {
    return null;
  }
}

describe('RetrievalCommand', () => {
  describe('getRequest', () => {
    test('Method should be GET', () => {
      const command = new StubRetrievalCommand('endpoint');

      const { method } = command.getRequest();

      expect(method).toBe('GET');
    });

    test('Content type should be undefined', () => {
      const command = new StubRetrievalCommand('endpoint');

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be that of endpoint', () => {
      const command = new StubRetrievalCommand('endpoint');

      const { path } = command.getRequest();

      expect(path).toBe('endpoint');
    });

    test('Body should be undefined', () => {
      const command = new StubRetrievalCommand('endpoint');

      const { body } = command.getRequest();

      expect(body).toBeUndefined();
    });
  });
});
