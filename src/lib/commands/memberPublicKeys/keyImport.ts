import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { Command } from '../Command.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import type { PostRequest } from '../../utils/http.js';
import { JsonValue } from '../../utils/serialisation/JsonValue.js';
import type { EndpointInput } from '../EndpointInput.js';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: { self: { type: 'string' } },
  required: ['self'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

/**
 * Input to the {@link MemberPublicKeyImportCommand}.
 * @category Member public key import
 */
export interface MemberPublicKeyImportInput extends EndpointInput {
  /**
   * ASN.1 DER-encoded public key.
   */
  readonly publicKeyDer: Buffer;

  /**
   * The OID of the service to which the key is to be bound.
   */
  readonly serviceOid: string;
}

/**
 * Output to the {@link MemberPublicKeyImportCommand}.
 * @property {string} self The path to the newly-imported key.
 * @category Member public key import
 * @interface
 */
export type MemberPublicKeyImportOutput = FromSchema<typeof RESPONSE_SCHEMA>;

/**
 * Command to import a member public key.
 * @category Member public key import
 */
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
