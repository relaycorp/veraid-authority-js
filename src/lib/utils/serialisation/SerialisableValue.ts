export interface SerialisableValue {
  serialise: () => BodyInit;
}
