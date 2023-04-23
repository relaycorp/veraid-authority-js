export abstract class AuthorityError extends Error {
  public override get name(): string {
    return this.constructor.name;
  }
}
