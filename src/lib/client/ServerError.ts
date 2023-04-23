import { AuthorityError } from '../AuthorityError.js';

/**
 * Represents a 5XX response or an unsupported server response.
 */
export class ServerError extends AuthorityError {}
