import type { Command } from '../commands/Command.js';
import { HTTP_STATUS_CODES, type Request, type RequestBody } from '../utils/http.js';

import { ServerError } from './ServerError.js';
import type { AuthorizationHeader } from './AuthorizationHeader.js';
import { ClientError } from './ClientError.js';

const USER_AGENT = 'VeraId Authority Client (https://github.com/relaycorp/veraid-authority-js)';
const JSON_CONTENT_TYPE = 'application/json';

interface BadRequestResponseBody {
  type?: string;
  message?: string;
}

export class AuthorityClient {
  protected readonly baseUrl: string;

  protected readonly authHeader: string;

  public constructor(baseUrl: string, authHeader: AuthorizationHeader) {
    // eslint-disable-next-line regexp/no-super-linear-move
    this.baseUrl = baseUrl.replace(/\/+$/u, '');

    this.authHeader = `${authHeader.scheme} ${authHeader.parameters}`;
  }

  /**
   * Sends a command to the authority server.
   * @param command The command to send.
   * @returns The command's output, if it succeeded.
   * @throws {ClientError} if the server rejects the request.
   * @throws {ServerError} if the server returns a `5XX` response or a response we don't support.
   */
  public async send<CommandOutput>(
    command: Command<unknown, CommandOutput, unknown>,
  ): Promise<CommandOutput> {
    const request = command.getRequest();
    const responsePayload = await this.makeRequest(request);
    return this.processResponse(responsePayload, command);
  }

  private async makeRequest(request: Request<RequestBody>): Promise<Response> {
    const contentType = request.contentType ?? JSON_CONTENT_TYPE;
    const headers = new Headers([
      ['Authorization', this.authHeader],
      ['Content-Type', contentType],
      ['User-Agent', USER_AGENT],
    ]);

    const url = `${this.baseUrl}${request.path}`;
    const body = request.body?.serialise();
    return fetch(url, { method: request.method, headers, body });
  }

  private async processResponse<CommandOutput>(
    response: Response,
    command: Command<unknown, CommandOutput, unknown>,
  ): Promise<CommandOutput> {
    const is2xxResponse = response.status < HTTP_STATUS_CODES.MULTIPLE_CHOICES;
    if (is2xxResponse) {
      const responsePayload = await command.responseDeserialiser.deserialise(response);
      return command.getOutput(responsePayload);
    }

    if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
      const errorPayload = (await response.json()) as BadRequestResponseBody;
      const reason = errorPayload.type ?? errorPayload.message ?? '(no reason provided)';
      throw new ClientError(`Server refused request as invalid: ${reason}`);
    }

    if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      throw new ClientError('Server refused access token');
    }

    if (response.status === HTTP_STATUS_CODES.FORBIDDEN) {
      throw new ClientError('Server denied authorisation');
    }

    throw new ServerError(`Unsupported status code (${response.status})`);
  }
}
