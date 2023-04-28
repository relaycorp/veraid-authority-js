import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { Command } from '../Command.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import type { PostRequest } from '../../utils/http.js';
import { JsonValue } from '../../utils/serialisation/JsonValue.js';
import type { EndpointInput } from '../EndpointInput.js';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: { token: { type: 'string' } },
  required: ['token'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

/**
 * Input to the {@link MemberKeyImportTokenCommand}.
 * @category Member public key token creation
 */
export interface MemberKeyImportTokenInput extends EndpointInput {
  /**
   * The OID of the service that the imported key will be bound to.
   */
  readonly serviceOid: string;
}

/**
 * Output from the {@link MemberKeyImportTokenCommand}.
 * @property {string} token The single-use import token.
 * @category Member public key token creation
 * @interface
 */
export type MemberKeyImportTokenOutput = FromSchema<typeof RESPONSE_SCHEMA>;

/**
 * Command to create a single-use token to import a member public key.
 * @category Member public key token creation
 */
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
