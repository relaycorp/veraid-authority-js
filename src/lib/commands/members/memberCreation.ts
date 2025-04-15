import type { FromSchema } from 'json-schema-to-ts';

import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import { JsonValue } from '../../utils/serialisation/JsonValue.js';
import type { PostRequest } from '../../utils/http.js';
import { Command } from '../Command.js';
import type { EndpointInput } from '../EndpointInput.js';

import type { MemberRole } from './MemberRole.js';

const RESPONSE_SCHEMA = {
  type: 'object',

  properties: {
    self: { type: 'string' },
    publicKeys: { type: 'string' },
    publicKeyImportTokens: { type: 'string' },
    signatureSpecs: { type: 'string' },
  },

  required: ['self', 'publicKeys', 'publicKeyImportTokens', 'signatureSpecs'],
} as const;
const RESPONSE_VALIDATOR = compileSchema(RESPONSE_SCHEMA);

/**
 * Input to the {@link MemberCreationCommand}.
 * @category Member creation
 */
export interface MemberCreationInput extends EndpointInput {
  /**
   * The name of the member, if they're a user.
   *
   * Leave `undefined` if the member is a bot.
   */
  readonly name?: string;

  /**
   * The email address of the member, if they should be allowed to access the API.
   */
  readonly email?: string;

  /**
   * The role of the member.
   */
  readonly role: MemberRole;
}

/**
 * Output to the {@link MemberCreationCommand}.
 * @property {string} self Path to newly-created member.
 * @property {string} publicKeys Path to newly-created member's public keys.
 * @property {string} publicKeyImportTokens Path to newly-created member's public key import tokens.
 * @category Member creation
 * @interface
 */
export type MemberCreationOutput = FromSchema<typeof RESPONSE_SCHEMA>;

/**
 * Command to create a new member.
 * @category Member creation
 */
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
