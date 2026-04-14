import { PageParser } from "../../page-parser";
import { PageFrontmatter } from "../../types";
import { PageBuildPipelineStep } from "../page-build-pipeline-step";
import {
  AfterFrontmatterParsingHook,
  BeforeFrontmatterParsingHook,
  FrontmatterParsingPipelineResult,
} from "./types";

/**
 * First sub-pipeline of the Page Building pipeline.
 * Parses the raw page frontmatter.
 *
 * Returns the frontmatter and raw markdown.
 */
export class PageFrontMatterParsingPipeline extends PageBuildPipelineStep<
  BeforeFrontmatterParsingHook,
  AfterFrontmatterParsingHook
> {
  private pageFrontmatter: PageFrontmatter | null = null;

  public constructor() {
    super();
  }

  public async handle(rawPageFileContent: string): Promise<FrontmatterParsingPipelineResult> {
    rawPageFileContent = await this.executeBeforeHooks(rawPageFileContent);

    const parsingResult = new PageParser().parse(rawPageFileContent);
    // TODO: handle error with new error type & bubbling

    this.pageFrontmatter = parsingResult.frontmatter;

    const rawPageMarkdownContent = await this.executeAfterHooks(parsingResult.content);

    return {
      frontmatter: this.pageFrontmatter,
      rawPageMarkdownContent,
    };
  }

  private async executeBeforeHooks(rawPageFileContent: string): Promise<string> {
    for (const beforeHook of this.beforeHooks) {
      rawPageFileContent = await beforeHook(rawPageFileContent);
    }

    return rawPageFileContent;
  }

  private async executeAfterHooks(rawPageMarkdownContent: string): Promise<string> {
    for (const afterHook of this.afterHooks) {
      rawPageMarkdownContent = await afterHook(this.pageFrontmatter!, rawPageMarkdownContent);
    }

    return rawPageMarkdownContent;
  }
}
