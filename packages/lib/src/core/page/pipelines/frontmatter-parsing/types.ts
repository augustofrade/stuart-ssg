import { PageFrontmatter } from "../../types";

/**
 * Allows changes of the raw file content of the Stuart Page.
 *
 * Expects a string, the raw file content of the Stuart Page, to be returned.
 */
export type BeforeFrontmatterParsingHook = (rawPageFileContent: string) => Promise<string>;

/**
 * Allows changes of the Stuart Page's frontmatter and its raw markdown content.
 *
 * Expects a string, the raw page markdown content, to be returned.
 * The frontmatter does not need to be returned as it is a reference type.
 */
export type AfterFrontmatterParsingHook = (
  frontmatter: PageFrontmatter,
  rawPageMarkdownContent: string
) => Promise<string>;

export interface FrontmatterParsingPipelineResult {
  frontmatter: PageFrontmatter;
  rawPageMarkdownContent: string;
}
