import { Deserialiser } from './Deserialiser.js';

const JSON_CONTENT_TYPE = 'application/json';

type SchemaValidator<Type> = (data: unknown) => data is Type;

export class JsonDeserialiser<Type> extends Deserialiser<Type> {
  public constructor(protected readonly validator: SchemaValidator<Type>) {
    super();
  }

  public override async deserialise(response: Response): Promise<Type | undefined> {
    const contentType = response.headers.get('Content-Type');
    if (contentType === null || !contentType.startsWith(JSON_CONTENT_TYPE)) {
      return undefined;
    }

    const json = await response.json();
    const isValid = this.validator(json);
    return isValid ? json : undefined;
  }
}
