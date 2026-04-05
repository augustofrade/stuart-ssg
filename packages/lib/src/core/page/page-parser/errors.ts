export class PageParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PageParsingError";
  }
}
