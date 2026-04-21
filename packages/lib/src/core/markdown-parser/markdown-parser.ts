import { marked } from "marked";

/**
 * Generic markdown parsing helper class that encapsulates logic.
 */
export class MarkdownParser {
  private readonly parser: Function;

  constructor() {
    this.parser = marked;
  }

  public parse(md: string): string {
    return this.parser(md);
  }
}
