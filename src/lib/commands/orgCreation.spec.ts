import { getJsonValue, makeJsonResponse } from '../../testUtils/jsonSerialisation.js';
import { ORG_NAME } from '../../testUtils/stubs.js';
import { SerialisationError } from '../utils/serialisation/SerialisationError.js';

import {
  OrgCreationCommand,
  type OrgCreationInput,
  type OrgCreationOutput,
} from './orgCreation.js';

const INPUT: OrgCreationInput = { name: ORG_NAME };

const OUTPUT: OrgCreationOutput = {
  self: `/orgs/${ORG_NAME}`,
  members: `/orgs/${ORG_NAME}/members`,
};

describe('OrgCreationCommand', () => {
  describe('responseDeserialiser', () => {
    test.each<keyof typeof OUTPUT>(['self', 'members'])(
      '%s URL path should be returned',
      async (pathName) => {
        const command = new OrgCreationCommand(INPUT);
        const output = { ...OUTPUT, [pathName]: undefined };
        const response = makeJsonResponse(output);

        await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
          SerialisationError,
        );
      },
    );

    test('Valid response body should be returned', async () => {
      const command = new OrgCreationCommand(INPUT);
      const response = makeJsonResponse(OUTPUT);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(output).toMatchObject(OUTPUT);
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

      expect(output).toBe(OUTPUT);
    });
  });
});
