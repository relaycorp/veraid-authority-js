/* eslint-disable max-classes-per-file */

export abstract class AuthorityError extends Error {
  public override get name(): string {
    return this.constructor.name;
  }
}

/**
 * Represents a 4XX response.
 */
export class ClientError extends AuthorityError {}

/**
 * Represents a 5XX response or an unsupported server response.
 */
export class ServerError extends AuthorityError {}
