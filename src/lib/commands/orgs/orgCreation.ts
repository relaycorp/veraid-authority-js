import { JsonValue } from '../../utils/serialisation/JsonValue.js';
import { JsonDeserialiser } from '../../utils/serialisation/JsonDeserialiser.js';
import { compileSchema } from '../../utils/serialisation/jsonSchema.js';
import type { PostRequest } from '../../utils/http.js';
import { Command } from '../Command.js';

const VALIDATOR = compileSchema({
  type: 'object',
  properties: { self: { type: 'string' }, members: { type: 'string' } },
  required: ['self', 'members'],
} as const);

/**
 * Input to the {@link OrgCreationCommand}.
 * @category Org creation
 */
export interface OrgCreationInput {
  /**
   * Name of the organisation (i.e., its domain name).
   */
  name: string;
}

/**
 * Output from the {@link OrgCreationCommand}.
 * @category Org creation
 */
export interface OrgCreationOutput {
  /**
   * Path to the newly-created organisation.
   */
  self: string;

  /**
   * Path to the newly-created organisation's members.
   */
  members: string;
}

/**
 * Command to create a new organisation.
 * @category Org creation
 */
export class OrgCreationCommand extends Command<
  OrgCreationInput,
  OrgCreationOutput,
  OrgCreationOutput
> {
  public responseDeserialiser = new JsonDeserialiser(VALIDATOR);

  public override getRequest(): PostRequest {
    return {
      method: 'POST',
      path: '/orgs',
      body: new JsonValue(this.input),
    };
  }

  public override getOutput(responseBody: OrgCreationOutput): OrgCreationOutput {
    return responseBody;
  }
}
