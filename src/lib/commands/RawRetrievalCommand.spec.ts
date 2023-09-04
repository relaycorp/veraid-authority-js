import { makeBufferResponse } from '../../testUtils/buffer.js';

import { RawRetrievalCommand } from './RawRetrievalCommand.js';

const INPUT = '/bundle';

describe('MemberBundleRetrievalCommand', () => {
  describe('getRequest', () => {
    test('Method should be GET', () => {
      const command = new RawRetrievalCommand(INPUT);

      const { method } = command.getRequest();

      expect(method).toBe('GET');
    });

    test('Content type should be undefined', () => {
      const command = new RawRetrievalCommand(INPUT);

      const { contentType } = command.getRequest();

      expect(contentType).toBeUndefined();
    });

    test('Path should be specified endpoint', () => {
      const command = new RawRetrievalCommand(INPUT);

      const { path } = command.getRequest();

      expect(path).toBe(INPUT);
    });

    test('Body should be undefined', () => {
      const command = new RawRetrievalCommand(INPUT);

      const { body } = command.getRequest();

      expect(body).toBeUndefined();
    });
  });

  describe('responseDeserialiser', () => {
    test('Body should be returned as is', async () => {
      const command = new RawRetrievalCommand(INPUT);
      const bodyBuffer = Buffer.from('the body');
      const response = makeBufferResponse(bodyBuffer);

      const output = await command.responseDeserialiser.deserialise(response);

      expect(Buffer.from(output)).toMatchObject(bodyBuffer);
    });
  });

  describe('getOutput', () => {
    test('Body should be returned as is', () => {
      const command = new RawRetrievalCommand(INPUT);
      const bodyBuffer = Buffer.from('the body');

      const output = command.getOutput(bodyBuffer);

      expect(Buffer.from(output)).toMatchObject(bodyBuffer);
    });
  });
});
