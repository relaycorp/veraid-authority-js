import type { Deserialiser } from '../utils/serialisation/Deserialiser.js';
import type { Request, RequestBody } from '../utils/http.js';

/**
 * Base class for commands.
 */
export abstract class Command<CommandInput, CommandOutput, ResponseBodyType> {
  public abstract responseDeserialiser: Deserialiser<ResponseBodyType>;

  public constructor(public readonly input: CommandInput) {}

  public abstract getRequest(): Request<RequestBody>;

  public abstract getOutput(responseBody: ResponseBodyType): CommandOutput;
}
