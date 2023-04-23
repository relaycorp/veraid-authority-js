import type { Deserialiser } from './Deserialiser.js';
import { SerialisationError } from './SerialisationError.js';

const JSON_CONTENT_TYPE = 'application/json';

type SchemaValidator<Type> = (data: unknown) => data is Type;

export class JsonDeserialiser<Type> implements Deserialiser<Type> {
  public constructor(protected readonly validator: SchemaValidator<Type>) {}

  public async deserialise(response: Response): Promise<Type> {
    const contentType = response.headers.get('Content-Type')!;
    if (!contentType.startsWith(JSON_CONTENT_TYPE)) {
      throw new SerialisationError(`Unsupported content type (${contentType})`);
    }

    let json: Type;
    try {
      json = await response.json();
    } catch {
      // Malformed JSON
      throw new SerialisationError('Value is malformed JSON');
    }

    const isValid = this.validator(json);
    if (isValid) {
      return json;
    }
    throw new SerialisationError('Value did not match schema');
  }
}
