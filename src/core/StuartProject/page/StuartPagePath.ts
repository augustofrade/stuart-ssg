import { basename, dirname } from "path";

/**
 * Represents a path to a page in the Stuart project.
 *
 * Provides methods to manipulate and retrieve information about the page path.
 */
export default class StuartPagePath {
  /**
   *
   * @param _projectPagePath Must be a path relative to the "pages" directory in the project.
   */
  public constructor(private readonly _projectPagePath: string) {}

  /**
   * Default project path representation of the page starting from `<project>/pages`.
   *
   * Example: `posts/index.html`
   */
  public fromProjectRoot(): string {
    return this._projectPagePath;
  }

  /**
   * Project path of the page starting from `<project>/pages` without the file extension.
   *
   * Example: `posts/index`
   */
  public withoutExtension(): string {
    return this._projectPagePath.slice(0, this._projectPagePath.lastIndexOf("."));
  }

  /**
   * Result project path of the page starting from `<project>/pages` with the `.html` extension.
   *
   * Examples:
   * - `posts/index.md` is converted to `posts/index.html`
   * - `index.md` is converted to `index.html`
   */
  public resultPath(): string {
    return this.withoutExtension() + ".html";
  }

  /**
   * The file name of the page, including the extension.
   *
   * Example: `index.md`
   */
  public fileName(): string {
    return this._projectPagePath.slice(this._projectPagePath.lastIndexOf("/") + 1);
  }

  /**
   * The base name of the file page, without the extension and the directory it's contained in.
   *
   * Example: `posts/index.md` is converted to `index`
   */
  public baseName(): string {
    const name = basename(this._projectPagePath);
    return name.slice(0, name.lastIndexOf("."));
  }

  /**
   * The directory name of the page path.
   *
   * Example: `posts/index.md` is converted to `posts`
   */
  public dirName(): string {
    return dirname(this._projectPagePath);
  }
}
