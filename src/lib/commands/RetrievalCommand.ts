import type { GetRequest } from '../utils/http.js';

import { Command } from './Command.js';

export abstract class RetrievalCommand<CommandOutput, ResponseBodyType> extends Command<
  string,
  CommandOutput,
  ResponseBodyType
> {
  public getRequest(): GetRequest {
    return { body: undefined, method: 'GET', path: this.input };
  }
}
