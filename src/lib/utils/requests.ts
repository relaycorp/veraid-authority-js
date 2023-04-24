import type { HttpMethod } from './http.js';
import type { SerialisableValue } from './serialisation/SerialisableValue.js';

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
