export interface Deserialiser<Type> {
  deserialise: (body: Response) => Promise<Type>;
}
