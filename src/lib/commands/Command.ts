import type { Request, RequestBody } from '../utils/requests.js';
import type { Deserialiser } from '../utils/serialisation/Deserialiser.js';

export abstract class Command<CommandInput, CommandOutput, ResponseBodyType> {
  public abstract responseDeserialiser: Deserialiser<ResponseBodyType>;

  public constructor(public readonly input: CommandInput) {}

  public abstract getRequest(): Request<RequestBody>;

  public abstract getOutput(responseBody: ResponseBodyType): CommandOutput;
}
