export class AUTH_ERROR extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
