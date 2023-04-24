import { compileSchema } from './jsonSchema.js';
import { JsonDeserialiser } from './JsonDeserialiser.js';
import { SerialisationError } from './SerialisationError.js';

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
    const headers = new Headers([['Content-Type', contentType]]);
    return new Response(body, { headers });
  }

  describe('deserialise', () => {
    describe('Content type', () => {
      test('application/json response should be allowed', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const body = makeResponse(JSON_CONTENT_TYPE);

        await expect(deserialiser.deserialise(body)).resolves.toMatchObject(JSON_BODY);
      });

      test('application/json* response should be allowed', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const body = makeResponse(`${JSON_CONTENT_TYPE}; charset=utf-8`);

        await expect(deserialiser.deserialise(body)).resolves.toMatchObject(JSON_BODY);
      });

      test('Non-JSON response should be refused', async () => {
        const deserialiser = new JsonDeserialiser(validator);
        const contentType = 'text/plain';
        const body = makeResponse(contentType); // Valid body, invalid content type

        await expect(deserialiser.deserialise(body)).rejects.toThrowWithMessage(
          SerialisationError,
          `Unsupported content type (${contentType})`,
        );
      });
    });

    test('Invalid value should return undefined', async () => {
      const deserialiser = new JsonDeserialiser(validator);
      const body = makeResponse(JSON_CONTENT_TYPE, '{}');

      await expect(deserialiser.deserialise(body)).rejects.toThrowWithMessage(
        SerialisationError,
        'Value did not match schema',
      );
    });

    test('Malformed value should return undefined', async () => {
      const deserialiser = new JsonDeserialiser(validator);
      const body = makeResponse(JSON_CONTENT_TYPE, '}');

      await expect(deserialiser.deserialise(body)).rejects.toThrowWithMessage(
        SerialisationError,
        'Value is malformed JSON',
      );
    });
  });
});
