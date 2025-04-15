import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { Command } from '../Command.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import type { PostRequest } from '../../utils/http.js';
import type { EndpointInput } from '../EndpointInput.js';
import { JsonValue } from '../../utils/serialisation/JsonValue.js';

const RESPONSE_SCHEMA = {
  type: 'object',

  properties: {
    self: { type: 'string' },
    exchangeUrl: { type: 'string' },
  },

  required: ['self', 'exchangeUrl'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

/**
 * OIDC Discovery authentication configuration.
 * @category Signature spec creation
 */
export interface OidcDiscoveryAuth {
  readonly type: 'oidc-discovery';
  readonly providerIssuerUrl: string;
  readonly jwtSubjectClaim: string;
  readonly jwtSubjectValue: string;
}

/**
 * Input to the {@link SignatureSpecCreationCommand}.
 * @category Signature spec creation
 */
export interface SignatureSpecCreationInput extends EndpointInput {
  /**
   * Authentication configuration.
   */
  readonly auth: OidcDiscoveryAuth;

  /**
   * The OID of the service to which the signature will be bound.
   */
  readonly serviceOid: string;

  /**
   * The plaintext to be signed.
   */
  readonly plaintext: ArrayBuffer;

  /**
   * Time-to-live for the signature in seconds.
   */
  readonly ttlSeconds?: number;
}

/**
 * Output to the {@link SignatureSpecCreationCommand}.
 * @property {string} self The path to the newly-created signature spec.
 * @property {string} exchangeUrl The URL to exchange credentials for a signature bundle.
 * @category Signature spec creation
 * @interface
 */
export type SignatureSpecCreationOutput = FromSchema<typeof RESPONSE_SCHEMA>;

/**
 * Command to create a signature spec.
 * @category Signature spec creation
 */
export class SignatureSpecCreationCommand extends Command<
  SignatureSpecCreationInput,
  SignatureSpecCreationOutput,
  SignatureSpecCreationOutput
> {
  public responseDeserialiser = new JsonDeserialiser(RESPONSE_VALIDATOR);

  public getRequest(): PostRequest {
    const body = new JsonValue({
      auth: this.input.auth,
      serviceOid: this.input.serviceOid,
      plaintext: Buffer.from(this.input.plaintext).toString('base64'),
      ttlSeconds: this.input.ttlSeconds,
    });

    return { method: 'POST', path: this.input.endpoint, body };
  }

  public getOutput(responseBody: SignatureSpecCreationOutput): SignatureSpecCreationOutput {
    return responseBody;
  }
}
