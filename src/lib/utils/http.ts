import type { SerialisableValue } from './serialisation/SerialisableValue.js';

type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST';

export const HTTP_STATUS_CODES = {
  MULTIPLE_CHOICES: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

export type RequestBody = SerialisableValue | undefined;

export interface Request<Body extends RequestBody> {
  method: HttpMethod;
  path: string;
  contentType?: string;
  body: Body;
}

export interface PostRequest extends Request<SerialisableValue> {
  method: 'POST';
}

export interface PatchRequest extends Request<SerialisableValue> {
  method: 'PATCH';
}

export interface GetRequest extends Request<undefined> {
  method: 'GET';
}

export interface DeleteRequest extends Request<undefined> {
  method: 'DELETE';
}
