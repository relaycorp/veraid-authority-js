import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import { RetrievalCommand } from '../RetrievalCommand.js';

import type { MemberRole } from './MemberRole.js';

const RESPONSE_SCHEMA = {
  type: 'object',

  properties: {
    name: { type: ['string', 'null'] },
    email: { type: ['string', 'null'], format: 'email' },

    role: {
      type: 'string',
      enum: ['ORG_ADMIN', 'REGULAR'],
    },
  },

  required: ['role'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

type ResponseSchema = FromSchema<typeof RESPONSE_SCHEMA>;

/**
 * Output from the {@link MemberRetrievalCommand}.
 * @property {string} name The name of the member, if they're a user.
 * @property {string} email The email address of the member.
 * @property {MemberRole} role The role of the member.
 * @category Member retrieval
 */
export interface MemberRetrievalOutput extends ResponseSchema {
  readonly role: MemberRole;
}

/**
 * Command to retrieve a member.
 * @category Member retrieval
 */
export class MemberRetrievalCommand extends RetrievalCommand<
  MemberRetrievalOutput,
  ResponseSchema
> {
  public responseDeserialiser = new JsonDeserialiser(RESPONSE_VALIDATOR);

  public getOutput(responseBody: MemberRetrievalOutput): MemberRetrievalOutput {
    return responseBody;
  }
}
