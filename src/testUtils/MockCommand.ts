import { Command } from '../lib/commands/Command.js';
import type { Request, RequestBody } from '../lib/utils/requests.js';

export class MockCommand<ReqBody extends RequestBody> extends Command<ReqBody, unknown, unknown> {
  public responseDeserialiser = {
    deserialise: async (body: Response) => body.json(),
  };

  public constructor(protected readonly request: Request<ReqBody>) {
    super(request.body);
  }

  public getRequest() {
    return this.request;
  }

  public getOutput(responseBody: unknown) {
    return responseBody;
  }
}
