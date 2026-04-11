export enum ContentNodeType {
  Page,
  Category,
}

export interface ContentNode {
  type: ContentNodeType;
  path: string;
  staticContent: string[];
}

export interface ContentNodePage extends ContentNode {}

export interface ContentNodeCategory extends ContentNode {
  name: string;
  categories: ContentNodeCategory[];
  pages: ContentNodePage[];
}

export type ProjectContentCategoriesSet = Record<string, ContentNodeCategory>;
