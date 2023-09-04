import { getJsonValue, makeJsonResponse } from '../../../testUtils/jsonSerialisation.js';
import { SerialisationError } from '../../utils/serialisation/SerialisationError.js';
import { SERVICE_OID } from '../../../testUtils/stubs.js';

import {
  MemberPublicKeyImportCommand,
  type MemberPublicKeyImportInput,
  type MemberPublicKeyImportOutput,
} from './keyImport.js';

const INPUT: MemberPublicKeyImportInput = {
  endpoint: '/endpoint',

  publicKeyDer: Buffer.from([0, 1, 2, 3, 4]),
  serviceOid: SERVICE_OID,
};

const OUTPUT: MemberPublicKeyImportOutput = {
  self: '/self',
  bundle: '/bundle',
};

describe('MemberPublicKeyImportCommand', () => {
  describe('responseDeserialiser', () => {
    test('URL should be returned', async () => {
      const command = new MemberPublicKeyImportCommand(INPUT);
      const response = makeJsonResponse({});

      await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
        SerialisationError,
      );
    });

    test('Valid response body should be returned', async () => {
      const command = new MemberPublicKeyImportCommand(INPUT);
      const response = makeJsonResponse(OUTPUT);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(output).toMatchObject(OUTPUT);
    });
  });

  describe('getRequest', () => {
    test('Method should be POST', () => {
      const command = new MemberPublicKeyImportCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('POST');
    });

    test('Content type should be undefined', () => {
      const command = new MemberPublicKeyImportCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be specified endpoint', () => {
      const command = new MemberPublicKeyImportCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT.endpoint);
    });

    describe('Body', () => {
      test('Public key should be Base64-encoded', () => {
        const command = new MemberPublicKeyImportCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { publicKey: string };
        expect(value.publicKey).toBe(INPUT.publicKeyDer.toString('base64'));
      });

      test('Service OID should be specified one', () => {
        const command = new MemberPublicKeyImportCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { serviceOid: string };
        expect(value.serviceOid).toBe(INPUT.serviceOid);
      });
    });
  });

  describe('getOutput', () => {
    test('Valid output should be returned', () => {
      const command = new MemberPublicKeyImportCommand(INPUT);

      const output = command.getOutput(OUTPUT);

      expect(output).toMatchObject(OUTPUT);
    });
  });
});
