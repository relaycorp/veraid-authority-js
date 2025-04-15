import { getJsonValue, makeJsonResponse } from '../../../testUtils/jsonSerialisation.js';
import { SerialisationError } from '../../utils/serialisation/SerialisationError.js';
import { SERVICE_OID } from '../../../testUtils/stubs.js';

import {
  SignatureSpecCreationCommand,
  type SignatureSpecCreationInput,
  type SignatureSpecCreationOutput,
  type OidcDiscoveryAuth,
} from './specCreation.js';

const AUTH: OidcDiscoveryAuth = {
  type: 'oidc-discovery',
  providerIssuerUrl: 'https://accounts.google.com',
  jwtSubjectClaim: 'email',
  jwtSubjectValue: 'user@example.com',
};

const INPUT: SignatureSpecCreationInput = {
  endpoint: '/endpoint',
  auth: AUTH,
  serviceOid: SERVICE_OID,
  plaintext: Buffer.from('Hello world'),
  ttlSeconds: 300,
};

const OUTPUT: SignatureSpecCreationOutput = {
  self: '/self',
  exchangeUrl: 'https://example.com/credentials/signatureBundles/123',
};

describe('SignatureSpecCreationCommand', () => {
  describe('responseDeserialiser', () => {
    test('Invalid response should throw SerialisationError', async () => {
      const command = new SignatureSpecCreationCommand(INPUT);
      const response = makeJsonResponse({});

      await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
        SerialisationError,
      );
    });

    test('Valid response body should be returned', async () => {
      const command = new SignatureSpecCreationCommand(INPUT);
      const response = makeJsonResponse(OUTPUT);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(output).toMatchObject(OUTPUT);
    });
  });

  describe('getRequest', () => {
    test('Method should be POST', () => {
      const command = new SignatureSpecCreationCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('POST');
    });

    test('Content type should be undefined', () => {
      const command = new SignatureSpecCreationCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be specified endpoint', () => {
      const command = new SignatureSpecCreationCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT.endpoint);
    });

    describe('Body', () => {
      test('Auth configuration should match input', () => {
        const command = new SignatureSpecCreationCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { auth: OidcDiscoveryAuth };
        expect(value.auth).toStrictEqual(INPUT.auth);
      });

      test('Service OID should be specified one', () => {
        const command = new SignatureSpecCreationCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { serviceOid: string };
        expect(value.serviceOid).toBe(INPUT.serviceOid);
      });

      test('Plaintext should be Base64-encoded', () => {
        const command = new SignatureSpecCreationCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { plaintext: string };
        expect(value.plaintext).toBe(Buffer.from('Hello world').toString('base64'));
      });

      test('TTL seconds should be included if specified', () => {
        const command = new SignatureSpecCreationCommand(INPUT);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { ttlSeconds: number };
        expect(value.ttlSeconds).toBe(INPUT.ttlSeconds);
      });

      test('TTL seconds should be omitted if not specified', () => {
        const inputWithoutTtl = { ...INPUT, ttlSeconds: undefined };
        const command = new SignatureSpecCreationCommand(inputWithoutTtl);

        const { body } = command.getRequest();

        const value = getJsonValue(body) as { ttlSeconds?: number };
        expect(value.ttlSeconds).toBeUndefined();
      });
    });
  });

  describe('getOutput', () => {
    test('Valid output should be returned', () => {
      const command = new SignatureSpecCreationCommand(INPUT);

      const output = command.getOutput(OUTPUT);

      expect(output).toMatchObject(OUTPUT);
    });
  });
});
