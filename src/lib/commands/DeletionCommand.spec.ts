import { NullDeserialiser } from '../utils/serialisation/NullDeserialiser.js';

import { DeletionCommand } from './DeletionCommand.js';

const INPUT = '/orgs/org-name';

describe('DeletionCommand', () => {
  test('Response deserialiser should be null deserialiser', () => {
    const command = new DeletionCommand(INPUT);

    expect(command.responseDeserialiser).toBeInstanceOf(NullDeserialiser);
  });

  describe('getRequest', () => {
    test('Method should be DELETE', () => {
      const command = new DeletionCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('DELETE');
    });

    test('Content type should be undefined', () => {
      const command = new DeletionCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be that of input', () => {
      const command = new DeletionCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT);
    });

    test('Body should be undefined', () => {
      const command = new DeletionCommand(INPUT);

      const { body } = command.getRequest();

      expect(body).toBeUndefined();
    });
  });

  test('Output should be null', () => {
    const command = new DeletionCommand(INPUT);

    const output = command.getOutput();

    expect(output).toBeNull();
  });
});
