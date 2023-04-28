/**
 * The authorisation header parameters representing the access token.
 */
export interface AuthorizationHeader {
  readonly scheme: string;
  readonly parameters: string;
}
