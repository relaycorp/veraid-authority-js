import type { Deserialiser } from './Deserialiser.js';

/**
 * Deserialiser that unconditionally returns `null` regardless of status code or body contents
 * (if any).
 */
export class NullDeserialiser implements Deserialiser<null> {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async deserialise(): Promise<null> {
    return null;
  }
}
