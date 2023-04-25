import { SerialisationError } from '../../utils/serialisation/SerialisationError.js';
import { MEMBER_EMAIL, ORG_NAME, USER_NAME } from '../../../testUtils/stubs.js';
import { makeJsonResponse } from '../../../testUtils/jsonSerialisation.js';

import { MemberRole } from './MemberRole.js';
import { MemberRetrievalCommand, type MemberRetrievalOutput } from './memberRetrieval.js';

const INPUT = `/orgs/${ORG_NAME}/members/foo`;

describe('MemberRetrievalCommand', () => {
  const baseResponseBody: MemberRetrievalOutput = {
    role: MemberRole.REGULAR,
  };

  describe('responseDeserialiser', () => {
    test('Name should be output if present', async () => {
      const command = new MemberRetrievalCommand(INPUT);
      const response = makeJsonResponse({ ...baseResponseBody, name: USER_NAME });

      const { name } = await command.responseDeserialiser.deserialise(response);

      expect(name).toBe(USER_NAME);
    });

    test('Name should be nullable', async () => {
      const command = new MemberRetrievalCommand(INPUT);
      const response = makeJsonResponse({ ...baseResponseBody, name: null });

      const { name } = await command.responseDeserialiser.deserialise(response);

      expect(name).toBeNull();
    });

    test('Email should be output if present', async () => {
      const command = new MemberRetrievalCommand(INPUT);
      const response = makeJsonResponse({ ...baseResponseBody, email: MEMBER_EMAIL });

      const { email } = await command.responseDeserialiser.deserialise(response);

      expect(email).toBe(MEMBER_EMAIL);
    });

    test('Email should be well-formed if present', async () => {
      const command = new MemberRetrievalCommand(INPUT);
      const response = makeJsonResponse({ ...baseResponseBody, email: 'invalid' });

      await expect(command.responseDeserialiser.deserialise(response)).rejects.toThrow(
        SerialisationError,
      );
    });

    test('Email should be nullable', async () => {
      const command = new MemberRetrievalCommand(INPUT);
      const response = makeJsonResponse({ ...baseResponseBody, email: null });

      const { email } = await command.responseDeserialiser.deserialise(response);

      expect(email).toBeNull();
    });

    test.each([MemberRole.REGULAR, MemberRole.ORG_ADMIN])('Role %s should be set', async (role) => {
      const command = new MemberRetrievalCommand(INPUT);
      const response = makeJsonResponse({ ...baseResponseBody, role });

      const { role: outputRole } = await command.responseDeserialiser.deserialise(response);

      expect(outputRole).toBe(role);
    });
  });

  describe('getOutput', () => {
    test('Name should be output', () => {
      const command = new MemberRetrievalCommand(INPUT);

      const { name } = command.getOutput({ ...baseResponseBody, name: USER_NAME });

      expect(name).toBe(USER_NAME);
    });

    test('Email should be output', () => {
      const command = new MemberRetrievalCommand(INPUT);

      const { email } = command.getOutput({ ...baseResponseBody, email: MEMBER_EMAIL });

      expect(email).toBe(MEMBER_EMAIL);
    });

    test.each([MemberRole.REGULAR, MemberRole.ORG_ADMIN])('Role %s should be output', (role) => {
      const command = new MemberRetrievalCommand(INPUT);

      const { role: outputRole } = command.getOutput({ ...baseResponseBody, role });

      expect(outputRole).toBe(role);
    });
  });
});
