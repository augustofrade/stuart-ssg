import matter from "gray-matter";
import { PageFrontmatter } from "..";
import { PageParsingError } from "./errors";
import { PageParsingResult } from "./types";

export class PageParser {
  public parse(rawPageContent: string): PageParsingResult {
    try {
      const result = matter(rawPageContent.trim(), {
        language: "yaml",
        delimiters: "---",
        excerpt: true,
      });

      return {
        frontmatter: result.data as PageFrontmatter,
        excerpt: result.excerpt ?? "",
        content: result.content ?? "",
      };
    } catch (e) {
      throw new PageParsingError(`Malformed YAML frontmatter syntax`);
    }
  }
}
