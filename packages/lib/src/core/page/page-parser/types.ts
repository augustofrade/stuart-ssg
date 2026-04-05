import { PageFrontmatter } from "../types";

export interface PageParsingResult {
  frontmatter: PageFrontmatter;
  excerpt: string;
  content: string;
}
