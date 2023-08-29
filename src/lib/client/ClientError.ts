import { AuthorityError } from '../AuthorityError.js';

/**
 * Represents a 4XX response.
 */
export class ClientError extends AuthorityError {
  public constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}
