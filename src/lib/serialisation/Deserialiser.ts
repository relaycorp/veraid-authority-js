export abstract class Deserialiser<Type> {
  public abstract deserialise(body: Body): Promise<Type | undefined>;
}
