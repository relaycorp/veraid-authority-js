import type { FromSchema } from 'json-schema-to-ts';

import type { MemberRole } from '../apiTypes/MemberRole.js';
import { compileSchema } from '../utils/serialisation/jsonSchema.js';
import { JsonDeserialiser } from '../utils/serialisation/JsonDeserialiser.js';
import { JsonValue } from '../utils/serialisation/JsonValue.js';
import type { PostRequest } from '../utils/http.js';

import { Command } from './Command.js';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: { self: { type: 'string' }, publicKeys: { type: 'string' } },
  required: ['self', 'publicKeys'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

export interface MemberCreationInput {
  readonly endpoint: string;

  readonly name?: string;
  readonly email?: string;
  readonly role: MemberRole;
}

export type MemberCreationOutput = FromSchema<typeof RESPONSE_SCHEMA>;

export class MemberCreationCommand extends Command<
  MemberCreationInput,
  MemberCreationOutput,
  MemberCreationOutput
> {
  public responseDeserialiser = new JsonDeserialiser(RESPONSE_VALIDATOR);

  public override getRequest(): PostRequest {
    const body = new JsonValue({
      name: this.input.name,
      email: this.input.email,
      role: this.input.role,
    });
    return { body, method: 'POST', path: this.input.endpoint };
  }

  public getOutput(responseBody: MemberCreationOutput): MemberCreationOutput {
    return responseBody;
  }
}
