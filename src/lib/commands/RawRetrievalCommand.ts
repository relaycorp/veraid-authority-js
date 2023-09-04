import { RawDeserialiser } from '../utils/serialisation/RawDeserialiser.js';

import { RetrievalCommand } from './RetrievalCommand.js';

export class RawRetrievalCommand extends RetrievalCommand<ArrayBuffer, ArrayBuffer> {
  public responseDeserialiser = new RawDeserialiser();

  public getOutput(responseBody: ArrayBuffer): ArrayBuffer {
    return responseBody;
  }
}
