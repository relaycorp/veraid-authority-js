import { MEMBER_EMAIL, ORG_NAME, USER_NAME } from '../../../testUtils/stubs.js';
import { getJsonValue, makeJsonResponse } from '../../../testUtils/jsonSerialisation.js';
import { SerialisationError } from '../../utils/serialisation/SerialisationError.js';

import { MemberRole } from './MemberRole.js';
import {
  MemberCreationCommand,
  type MemberCreationInput,
  type MemberCreationOutput,
} from './memberCreation.js';

const INPUT: MemberCreationInput = {
  endpoint: `/orgs/${ORG_NAME}/members`,
  role: MemberRole.REGULAR,
};

const OUTPUT: MemberCreationOutput = {
  self: `/orgs/${ORG_NAME}/members/${USER_NAME}`,
  publicKeys: `/orgs/${ORG_NAME}/members/${USER_NAME}/publicKeys`,
  publicKeyImportTokens: `/orgs/${ORG_NAME}/members/${USER_NAME}/publicKeyImportTokens`,
  signatureSpecs: `/orgs/${ORG_NAME}/members/${USER_NAME}/signature-specs`,
};

type MemberCreationRequestBody = Omit<MemberCreationInput, 'endpoint'>;

describe('MemberCreationCommand', () => {
  describe('responseDeserialiser', () => {
    test.each<keyof MemberCreationOutput>(['self', 'publicKeys', 'publicKeyImportTokens'])(
      '%s URL path should be returned',
      async (pathName) => {
        const command = new MemberCreationCommand(INPUT);
        const responseBody = { ...OUTPUT, [pathName]: undefined };
        const response = makeJsonResponse(responseBody);

        await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
          SerialisationError,
        );
      },
    );

    test('Valid response body should be returned', async () => {
      const command = new MemberCreationCommand(INPUT);
      const response = makeJsonResponse(OUTPUT);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(output).toMatchObject(OUTPUT);
    });
  });

  describe('getRequest', () => {
    test('Method should be POST', () => {
      const command = new MemberCreationCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('POST');
    });

    test('Content type should be undefined', () => {
      const command = new MemberCreationCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be specified endpoint', () => {
      const command = new MemberCreationCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT.endpoint);
    });

    describe('Body', () => {
      test.each([MemberRole.REGULAR, MemberRole.ORG_ADMIN])('Role %s should be set', (role) => {
        const command = new MemberCreationCommand({ ...INPUT, role });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberCreationRequestBody;
        expect(value.role).toBe(role);
      });

      test('Email should be set if specified', () => {
        const command = new MemberCreationCommand({ ...INPUT, email: MEMBER_EMAIL });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberCreationRequestBody;
        expect(value.email).toBe(MEMBER_EMAIL);
      });

      test('Email should be absent if unspecified', () => {
        const command = new MemberCreationCommand({ ...INPUT, email: undefined });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberCreationRequestBody;
        expect(value.email).toBeUndefined();
      });

      test('Name should be set if specified', () => {
        const command = new MemberCreationCommand({ ...INPUT, name: USER_NAME });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberCreationRequestBody;
        expect(value.name).toBe(USER_NAME);
      });

      test('Name should be absent if unspecified', () => {
        const command = new MemberCreationCommand({ ...INPUT, name: undefined });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberCreationRequestBody;
        expect(value.name).toBeUndefined();
      });
    });
  });

  describe('getOutput', () => {
    test('Response body should be returned as is', () => {
      const command = new MemberCreationCommand(INPUT);

      const output = command.getOutput(OUTPUT);

      expect(output).toMatchObject(OUTPUT);
    });
  });
});
