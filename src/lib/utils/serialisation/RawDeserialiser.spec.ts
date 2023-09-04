import { makeBufferResponse } from '../../../testUtils/buffer.js';

import { RawDeserialiser } from './RawDeserialiser.js';

describe('RawDeserialiser', () => {
  test('Should output body as is', async () => {
    const deserialiser = new RawDeserialiser();
    const bodyBuffer = Buffer.from('the body');
    const response = makeBufferResponse(bodyBuffer);

    const output = await deserialiser.deserialise(response);

    expect(Buffer.from(output)).toMatchObject(bodyBuffer);
  });
});
