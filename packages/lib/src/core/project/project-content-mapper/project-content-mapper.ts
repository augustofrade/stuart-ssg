import { Dirent } from "fs";
import fs from "fs/promises";
import path from "path";
import { Directories } from "../../directories";
import { Files } from "../../files";
import { ConflictingContentTypeMismatchError } from "./errors";

/**
 * Maps a project's content into an object tree representation.
 *
 * Starting at the Project Content Root directory, each category has:
 * - Content File (category.md)
 * - subcategories
 * - pages
 * - static content
 * Pages have:
 *  - Content File (index.md)
 * - static content
 *
 * @remakrs
 * During the mapping process the Project Content Root is also a category.
 *
 * @summary
 * Recursive Process Steps:
 * 1. Read the directory and check for a Content File (_index.md_ or _category.md_) to determine its role.
 * 2. If only _index.md_ is present:
 *    - Treat the directory as a **Page**.
 *    - Mark everything in it as **static content**.
 * 3. If only _category.md_ is present:
 *    - Treat the directory as a **Category**.
 *    - Recursively process its children starting from step 1.
 *    - Mark any files in the Category Root (not matched by rules 2 or 3) as **static content**.
 * 4. If no Content File is found:
 *    - Treat the directory as **static content** under its parent category.
 * 5. If both _index.md_ and _category.md_ are present:
 *    - Throw an error due to conflicting definitions.
 */
export class ProjectContentMapper {
  private constructor() {}

  /**
   * Maps a project content located in the passed projectRoot path.
   *
   * @param projectRoot Path to the Project Root, directory expected.
   * @returns Tree representation of the Project Content
   */
  public static async handle(projectRoot: string) {
    if (!path.isAbsolute(projectRoot)) {
      projectRoot = path.resolve(projectRoot);
    }
    const contentRoot = path.join(projectRoot, Directories.CONTENT);

    const rootCategory = this.createCategory("", contentRoot);
    return this.mapCategory(rootCategory);
  }

  /**
   * Category Factory
   * @param name Name of the category (ex: blog or animals/cat)
   * @param path Root Path of the category
   */
  private static createCategory(name: string, path: string): DirCategory {
    return {
      type: DirItemType.Category,
      path,
      name,
      categories: [],
      pages: [],
      staticContent: [],
    };
  }

  /**
   * Page Factory
   * @param path Root Path of the page
   */
  private static createPage(path: string): DirPage {
    return {
      type: DirItemType.Page,
      path,
      staticContent: [],
    };
  }

  /**
   * Recursively maps a category directory alongisde mapDirectory,
   * filtering its content based on its type (category, page, static content)
   * @param category Category representation of a directory
   */
  private static async mapCategory(category: DirCategory) {
    const items = await this.readDir(category.path);
    for (const item of items) {
      if (item.name === Files.CATEGORY_ROOT) continue;

      const fullChildItemPath = path.join(category.path, item.name);

      if (item.isDirectory()) {
        const result = await this.mapDirectory(fullChildItemPath, item.name, category.name);
        switch (result?.type) {
          case DirItemType.Page:
            category.pages.push(result as DirPage);
            break;
          case DirItemType.Category:
            category.categories.push(result as DirCategory);
            break;
          default:
            category.staticContent.push(fullChildItemPath);
        }
      } else {
        category.staticContent.push(fullChildItemPath);
      }
    }

    return category;
  }

  /**
   * Straightforward. Maps a page marking everything on its directory as its static content.
   * @param page Page representation of a directory
   */
  private static async mapPage(page: DirPage) {
    const items = await this.readDir(page.path);
    for (const item of items) {
      if (item.name === Files.PAGE) continue;
      page.staticContent.push(path.join(page.path, item.name));
    }
    return page;
  }

  /**
   * Maps a directory into a Content Directory representation object
   * by checking its content.
   *
   * Works recursively alongside mapCategory if the directory is a category.
   *
   * @param fullPath Full path to map
   * @param dirName dirname of the path (ex: project/content/blog/post-1 -> post-1)
   * @param parentCategory Name of the parent category (ex: blog)
   * @returns A Content Directory representation object
   */
  private static async mapDirectory(
    fullPath: string,
    dirName: string,
    parentCategory: string
  ): Promise<DirItem | undefined> {
    const dirents = await this.readDir(fullPath);
    const [isPage, isCategory] = this.getDirStats(dirents);
    if (isPage && isCategory) throw new ConflictingContentTypeMismatchError(fullPath);
    if (isPage) {
      const page = this.createPage(fullPath);
      return this.mapPage(page);
    }

    if (isCategory) {
      const category = this.createCategory(path.join(parentCategory, dirName), fullPath);
      return this.mapCategory(category);
    }

    return undefined;
  }

  private static async readDir(dir: string) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    return dirents;
  }

  private static getDirStats(dirents: Dirent<string>[]): [boolean, boolean] {
    let isPage = false;
    let isCategory = false;
    for (let item of dirents) {
      if (item.isFile()) {
        if (item.name === Files.CATEGORY_ROOT) isCategory = true;
        else if (item.name === Files.PAGE) isPage = true;
      }
    }

    return [isPage, isCategory];
  }
}

enum DirItemType {
  Page,
  Category,
}

interface DirItem {
  type: DirItemType;
  path: string;
  staticContent: string[];
}

interface DirPage extends DirItem {}

interface DirCategory extends DirItem {
  name: string;
  categories: DirCategory[];
  pages: DirPage[];
}
