import { compileSchema } from '../utils/jsonSchema.js';

import { JsonDeserialiser } from './JsonDeserialiser.js';

const JSON_CONTENT_TYPE = 'application/json';

const JSON_BODY = { foo: 'bar' };
const JSON_BODY_STRING = JSON.stringify(JSON_BODY);

describe('JsonDeserialiser', () => {
  const validator = compileSchema({
    type: 'object',
    properties: { foo: { type: 'string' } },
    required: ['foo'],
  } as const);

  function makeResponse(contentType: string, body: BodyInit = JSON_BODY_STRING) {
    const headers = new Headers();
    headers.append('Content-Type', contentType);
    return new Response(body, { headers });
  }

  describe('deserialise', () => {
    describe('Content type', () => {
      test('application/json response should be deserialised', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const body = makeResponse(JSON_CONTENT_TYPE);

        await expect(deserialiser.deserialise(body)).resolves.toMatchObject(JSON_BODY);
      });

      test('application/json* response should be deserialised', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const body = makeResponse(`${JSON_CONTENT_TYPE}; charset=utf-8`);

        await expect(deserialiser.deserialise(body)).resolves.toMatchObject(JSON_BODY);
      });

      test('Non-JSON response should not be deserialised', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const body = makeResponse('text/plain'); // Valid body, invalid content type

        await expect(deserialiser.deserialise(body)).resolves.toBeUndefined();
      });

      test('Missing content type should not be deserialised', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const body = new Response(JSON_BODY_STRING);

        await expect(deserialiser.deserialise(body)).resolves.toBeUndefined();
      });
    });

    test('Invalid value should return undefined', async () => {
      const deserialiser = new JsonDeserialiser(validator);
      const body = makeResponse(JSON_CONTENT_TYPE, '{}');

      await expect(deserialiser.deserialise(body)).resolves.toBeUndefined();
    });
  });
});
