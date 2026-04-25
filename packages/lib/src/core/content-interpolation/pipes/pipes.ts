/**
 * Content Interpolation Pipe callback store. Handles pipe registration and fetching.
 */
export class ContentInterpolationPipes {
  private static pipes: Record<string, Function> = {};

  /**
   * Gets a pipe callback by its name
   * @param pipe Pipe name
   * @returns
   */
  public static get(pipe: string): Function | undefined {
    return this.pipes[pipe];
  }

  /**
   * Registers a pipe callback. Overwrites any existing pipe with the provided name.
   * @param pipe pipe name
   * @param callback Callback to be executed
   *
   * @example
   * ```typescript
   * ContentInterpolationPipes.registerPipe("date", defaultDateFormatter);
   * // Can be used with { <context-key> | date }
   * ```
   */
  public static registerPipe(pipe: string, callback: Function) {
    this.pipes[pipe] = callback;
  }
}
