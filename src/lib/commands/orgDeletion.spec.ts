import { NullDeserialiser } from '../utils/serialisation/NullDeserialiser.js';

import { OrgDeletionCommand, type OrgDeletionInput } from './orgDeletion.js';

const INPUT: OrgDeletionInput = { path: '/orgs/org-name' };

describe('OrgDeletionCommand', () => {
  test('Response deserialiser should be null deserialiser', () => {
    const command = new OrgDeletionCommand(INPUT);

    expect(command.responseDeserialiser).toBeInstanceOf(NullDeserialiser);
  });

  describe('getRequest', () => {
    test('Method should be DELETE', () => {
      const command = new OrgDeletionCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('DELETE');
    });

    test('Content type should be undefined', () => {
      const command = new OrgDeletionCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be that of input', () => {
      const command = new OrgDeletionCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT.path);
    });

    test('Body should be undefined', () => {
      const command = new OrgDeletionCommand(INPUT);

      const { body } = command.getRequest();

      expect(body).toBeUndefined();
    });
  });

  test('Output should be null', () => {
    const command = new OrgDeletionCommand(INPUT);

    const output = command.getOutput();

    expect(output).toBeNull();
  });
});
