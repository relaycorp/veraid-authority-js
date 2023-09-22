import { getJsonValue, makeJsonResponse } from '../../../testUtils/jsonSerialisation.js';
import { ORG_NAME } from '../../../testUtils/stubs.js';
import { SerialisationError } from '../../utils/serialisation/SerialisationError.js';
import { derSerialisePublicKey, generatePublicKey } from '../../../testUtils/crypto.js';

import {
  OrgCreationCommand,
  type OrgCreationInput,
  type OrgCreationOutput,
} from './orgCreation.js';

const INPUT: OrgCreationInput = { name: ORG_NAME };

const PUBLIC_KEY = await generatePublicKey();
const OUTPUT: OrgCreationOutput = {
  self: `/orgs/${ORG_NAME}`,
  members: `/orgs/${ORG_NAME}/members`,
  publicKey: PUBLIC_KEY,
};
const OUTPUT_SERIALISED = {
  ...OUTPUT,
  publicKey: await derSerialisePublicKey(OUTPUT.publicKey),
};

describe('OrgCreationCommand', () => {
  describe('responseDeserialiser', () => {
    test.each<keyof typeof OUTPUT_SERIALISED>(['self', 'members', 'publicKey'])(
      '%s field should be returned',
      async (name) => {
        const command = new OrgCreationCommand(INPUT);
        const output = { ...OUTPUT, [name]: undefined };
        const response = makeJsonResponse(output);

        await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
          SerialisationError,
        );
      },
    );

    test('Valid response body should be returned', async () => {
      const command = new OrgCreationCommand(INPUT);
      const response = makeJsonResponse(OUTPUT_SERIALISED);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(output).toMatchObject(OUTPUT_SERIALISED);
    });
  });

  describe('getRequest', () => {
    test('Method should be post', () => {
      const command = new OrgCreationCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('POST');
    });

    test('Content type should be undefined', () => {
      const command = new OrgCreationCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be /orgs', () => {
      const command = new OrgCreationCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe('/orgs');
    });

    test('Body should contain org name', () => {
      const command = new OrgCreationCommand(INPUT);

      const { body } = command.getRequest();

      const value = getJsonValue(body) as OrgCreationInput;
      expect(value.name).toBe(ORG_NAME);
    });
  });

  describe('getOutput', () => {
    test('Response body should be returned as is', () => {
      const command = new OrgCreationCommand(INPUT);

      const output = command.getOutput(OUTPUT);

      expect(output).toMatchObject(OUTPUT_SERIALISED);
    });
  });
});
