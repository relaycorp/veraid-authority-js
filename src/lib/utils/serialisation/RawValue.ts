import type { SerialisableValue } from './SerialisableValue.js';

export class RawValue implements SerialisableValue {
  public constructor(public readonly value: BodyInit) {}

  public serialise(): BodyInit {
    return this.value;
  }
}
