import type { SerialisableValue } from '../lib/utils/serialisation/SerialisableValue.js';
import { JsonValue } from '../lib/utils/serialisation/JsonValue.js';
import { JSON_CONTENT_TYPE } from '../lib/utils/serialisation/JsonDeserialiser.js';

export function makeJsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: new Headers([['Content-Type', JSON_CONTENT_TYPE]]),
  });
}

export function getJsonValue(value: SerialisableValue): unknown {
  expect(value).toBeInstanceOf(JsonValue);
  return (value as JsonValue<unknown>).value;
}
