import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { Command } from '../Command.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import type { PostRequest } from '../../utils/http.js';
import { JsonValue } from '../../utils/serialisation/JsonValue.js';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: { token: { type: 'string' } },
  required: ['token'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

export interface MemberKeyImportTokenInput {
  readonly endpoint: string;

  readonly serviceOid: string;
}

export type MemberKeyImportTokenOutput = FromSchema<typeof RESPONSE_SCHEMA>;

export class MemberKeyImportTokenCommand extends Command<
  MemberKeyImportTokenInput,
  MemberKeyImportTokenOutput,
  MemberKeyImportTokenOutput
> {
  public responseDeserialiser = new JsonDeserialiser(RESPONSE_VALIDATOR);

  public getRequest(): PostRequest {
    const body = new JsonValue({
      serviceOid: this.input.serviceOid,
    });
    return { body, method: 'POST', path: this.input.endpoint };
  }

  public getOutput(responseBody: MemberKeyImportTokenOutput): MemberKeyImportTokenOutput {
    return responseBody;
  }
}
