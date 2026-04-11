import { ContentNodeCategory, ProjectContentCategoriesSet } from "./types";

/**
 * Represents the tree structure of the Content of a Stuart Project
 * with its different nodes (categories and pages).
 *
 * Provides getters for the available categories, root of the tree and node data of a category.
 */
export class ProjectContentTree {
  public readonly categories: readonly string[];

  public constructor(
    private readonly contentTree: ContentNodeCategory,
    private readonly contentCategoriesSet: ProjectContentCategoriesSet
  ) {
    // remove root category from list
    const categories = Object.keys(contentCategoriesSet).filter((c) => c !== "");
    this.categories = Object.freeze(categories);
  }

  /**
   * Gets the root node of the Content tree, that is, the root ("") category.
   */
  public get root(): Readonly<ContentNodeCategory> {
    return this.contentTree;
  }

  /**
   * Gets the node of a tree of the specified category.
   * @returns ContentNode of the category if valid.
   */
  public getCategory(category: string): ContentNodeCategory | undefined {
    return this.contentCategoriesSet[category];
  }
}
