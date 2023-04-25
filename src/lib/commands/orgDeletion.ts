import { NullDeserialiser } from '../utils/serialisation/NullDeserialiser.js';
import type { DeleteRequest } from '../utils/requests.js';

import { Command } from './Command.js';

export interface OrgDeletionInput {
  endpoint: string;
}

export class OrgDeletionCommand extends Command<OrgDeletionInput, null, null> {
  public responseDeserialiser = new NullDeserialiser();

  public getRequest(): DeleteRequest {
    return { body: undefined, method: 'DELETE', path: this.input.endpoint };
  }

  public getOutput(): null {
    return null;
  }
}
