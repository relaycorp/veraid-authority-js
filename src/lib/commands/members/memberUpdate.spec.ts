import { NullDeserialiser } from '../../utils/serialisation/NullDeserialiser.js';
import { MEMBER_EMAIL, USER_NAME } from '../../../testUtils/stubs.js';
import { getJsonValue } from '../../../testUtils/jsonSerialisation.js';

import { MemberRole } from './MemberRole.js';
import { MemberUpdateCommand, type MemberUpdateInput } from './memberUpdate.js';

const INPUT: MemberUpdateInput = {
  endpoint: '/endpoint',
};

describe('MemberUpdateInput', () => {
  test('Response deserialiser should be null deserialiser', () => {
    const command = new MemberUpdateCommand(INPUT);

    expect(command.responseDeserialiser).toBeInstanceOf(NullDeserialiser);
  });

  describe('getRequest', () => {
    test('Method should be PATCH', () => {
      const command = new MemberUpdateCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('PATCH');
    });

    test('Content type should be unset', () => {
      const command = new MemberUpdateCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be that of input', () => {
      const command = new MemberUpdateCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT.endpoint);
    });

    describe('Body', () => {
      test.each([
        ['string', USER_NAME],
        ['null', null],
      ])('Name should be %s if specified', (_type, name) => {
        const command = new MemberUpdateCommand({ ...INPUT, name });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberUpdateInput;
        expect(value.name).toBe(name);
      });

      test.each([
        ['string', MEMBER_EMAIL],
        ['null', null],
      ])('Email should be %s if specified', (_type, email) => {
        const command = new MemberUpdateCommand({ ...INPUT, email });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberUpdateInput;
        expect(value.email).toBe(email);
      });

      test('Role should be set if specified', () => {
        const role = MemberRole.REGULAR;
        const command = new MemberUpdateCommand({ ...INPUT, role });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberUpdateInput;
        expect(value.role).toBe(role);
      });

      test('Role should be absent if unspecified', () => {
        const command = new MemberUpdateCommand({ ...INPUT, role: undefined });

        const { body } = command.getRequest();

        const value = getJsonValue(body) as MemberUpdateInput;
        expect(value.role).toBeUndefined();
      });
    });
  });

  test('Output should be null', () => {
    const command = new MemberUpdateCommand(INPUT);

    const output = command.getOutput();

    expect(output).toBeNull();
  });
});
