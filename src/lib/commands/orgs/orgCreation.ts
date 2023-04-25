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

export interface OrgCreationInput {
  name: string;
}

export interface OrgCreationOutput {
  self: string;
  members: string;
}

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
