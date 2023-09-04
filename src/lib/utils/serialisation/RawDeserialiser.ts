import type { Deserialiser } from './Deserialiser.js';

export class RawDeserialiser implements Deserialiser<ArrayBuffer> {
  public async deserialise(response: Response): Promise<ArrayBuffer> {
    return response.arrayBuffer();
  }
}
