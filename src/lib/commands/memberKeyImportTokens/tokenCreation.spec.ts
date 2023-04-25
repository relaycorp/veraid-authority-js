import { getJsonValue, makeJsonResponse } from '../../../testUtils/jsonSerialisation.js';
import { SerialisationError } from '../../utils/serialisation/SerialisationError.js';
import { SERVICE_OID } from '../../../testUtils/stubs.js';

import {
  MemberKeyImportTokenCommand,
  type MemberKeyImportTokenInput,
  type MemberKeyImportTokenOutput,
} from './tokenCreation.js';

const INPUT: MemberKeyImportTokenInput = {
  endpoint: '/endpoint',

  serviceOid: SERVICE_OID,
};

const OUTPUT: MemberKeyImportTokenOutput = {
  token: 'the token',
};

describe('MemberPublicKeyImportCommand', () => {
  describe('responseDeserialiser', () => {
    test('URL should be returned', async () => {
      const command = new MemberKeyImportTokenCommand(INPUT);
      const response = makeJsonResponse({});

      await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
        SerialisationError,
      );
    });

    test('Valid response body should be returned', async () => {
      const command = new MemberKeyImportTokenCommand(INPUT);
      const response = makeJsonResponse(OUTPUT);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(output).toMatchObject(OUTPUT);
    });
  });

  describe('getRequest', () => {
    test('Method should be POST', () => {
      const command = new MemberKeyImportTokenCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('POST');
    });

    test('Content type should be undefined', () => {
      const command = new MemberKeyImportTokenCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be specified endpoint', () => {
      const command = new MemberKeyImportTokenCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT.endpoint);
    });

    describe('Body', () => {
      test('Service OID should be specified one', () => {
        const command = new MemberKeyImportTokenCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { serviceOid: string };
        expect(value.serviceOid).toBe(INPUT.serviceOid);
      });
    });
  });

  describe('getOutput', () => {
    test('Valid output should be returned', () => {
      const command = new MemberKeyImportTokenCommand(INPUT);

      const output = command.getOutput(OUTPUT);

      expect(output).toMatchObject(OUTPUT);
    });
  });
});
