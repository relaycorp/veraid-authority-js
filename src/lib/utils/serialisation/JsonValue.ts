import type { SerialisableValue } from './SerialisableValue.js';

export class JsonValue<Type> implements SerialisableValue {
  public constructor(public readonly value: Type) {}

  public serialise(): string {
    return JSON.stringify(this.value);
  }
}
