import path from "path";
import { Directories } from "../directories";

/**
 * Extracts the category path from a page directory by computing its relative path
 * from the content root directory.
 *
 * @param projectRoot - The root directory of the project. Must be absolute
 * @param pageDir - The directory path of the page. Must be absolute
 * @returns The relative path from the content root directory to the page directory,
 *          representing the category structure
 *
 * @example
 * ```
 * const category = getCategoryFromPageDirectory('/home/user/project', '/home/user/project/content/blog/posts/my-post');
 * // Returns: 'blog/posts'
 * ```
 */
export function getCategoryFromPageDirectory(projectRoot: string, pageDir: string) {
  pageDir = path.dirname(pageDir);
  projectRoot = path.dirname(projectRoot);
  const contentRootDir = path.join(projectRoot, Directories.CONTENT);

  return path.relative(contentRootDir, pageDir);
}
