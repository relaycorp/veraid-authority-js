import { NullDeserialiser } from '../utils/serialisation/NullDeserialiser.js';
import type { DeleteRequest } from '../utils/requests.js';

import { Command } from './Command.js';

export class DeletionCommand extends Command<string, null, null> {
  public responseDeserialiser = new NullDeserialiser();

  public getRequest(): DeleteRequest {
    return { body: undefined, method: 'DELETE', path: this.input };
  }

  public getOutput(): null {
    return null;
  }
}
