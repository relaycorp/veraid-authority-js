import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { Command } from '../Command.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import type { PostRequest } from '../../utils/http.js';
import { JsonValue } from '../../utils/serialisation/JsonValue.js';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: { self: { type: 'string' } },
  required: ['self'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

export interface MemberPublicKeyImportInput {
  readonly endpoint: string;

  readonly publicKeyDer: Buffer;
  readonly serviceOid: string;
}

export type MemberPublicKeyImportOutput = FromSchema<typeof RESPONSE_SCHEMA>;

export class MemberPublicKeyImportCommand extends Command<
  MemberPublicKeyImportInput,
  MemberPublicKeyImportOutput,
  MemberPublicKeyImportOutput
> {
  public responseDeserialiser = new JsonDeserialiser(RESPONSE_VALIDATOR);

  public getRequest(): PostRequest {
    const body = new JsonValue({
      publicKey: this.input.publicKeyDer.toString('base64'),
      serviceOid: this.input.serviceOid,
    });
    return { body, method: 'POST', path: this.input.endpoint };
  }

  public getOutput(responseBody: MemberPublicKeyImportOutput): MemberPublicKeyImportOutput {
    return responseBody;
  }
}
