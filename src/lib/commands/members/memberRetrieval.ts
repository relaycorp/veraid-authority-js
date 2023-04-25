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

export interface MemberRetrievalOutput extends ResponseSchema {
  readonly role: MemberRole;
}

export class MemberRetrievalCommand extends RetrievalCommand<
  MemberRetrievalOutput,
  ResponseSchema
> {
  public responseDeserialiser = new JsonDeserialiser(RESPONSE_VALIDATOR);

  public getOutput(responseBody: MemberRetrievalOutput): MemberRetrievalOutput {
    return responseBody;
  }
}
