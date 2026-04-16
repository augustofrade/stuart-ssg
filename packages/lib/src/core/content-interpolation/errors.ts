export class InvalidQueryError extends Error {
  constructor(part: string, currentContext: string, fullQuery: string, expectedType = "undefined") {
    super(
      `Cannot access '${part}' property on '${currentContext}' in query '${fullQuery}'. Expected Record, found ${expectedType}`
    );
    this.name = "InvalidQueryError";
  }
}
