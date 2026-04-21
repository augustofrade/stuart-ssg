import { BuildContext } from "../../../build-context";
import { ContentInterpolator } from "../../../content-interpolation";
import { StuartProject } from "../../../project";
import { PageBuildPipelineStep } from "../page-build-pipeline-step";
import {
  AfterPageTokenInjectionHook,
  BeforePageTokenInjectionHook,
  PageTokenInjectionPipelineResult,
} from "./types";

/**
 * Third sub-pipeline of the Page Building pipeline.
 * Handles content interpolation of all tokens in the page markdown.
 *
 * Returns the final markdown of the page, ready to be parsed into HTML.
 */
export class PageTokenInjectionPipeline extends PageBuildPipelineStep<
  BeforePageTokenInjectionHook,
  AfterPageTokenInjectionHook
> {
  public constructor(
    private readonly buildContext: BuildContext,
    private readonly project: StuartProject
  ) {
    super();
  }

  public async handle(pageMarkdown: string): Promise<PageTokenInjectionPipelineResult> {
    pageMarkdown = await this.executeBeforeHooks(pageMarkdown);

    pageMarkdown = new ContentInterpolator(pageMarkdown, this.buildContext, this.project).handle();
    // TODO: handle error with new error type & bubbling

    const finalMarkdown = await this.executeAfterHooks(pageMarkdown);

    return {
      pageMarkdown: finalMarkdown,
    };
  }

  private async executeBeforeHooks(pageMarkdown: string): Promise<string> {
    for (const beforeHook of this.beforeHooks) {
      pageMarkdown = await beforeHook(pageMarkdown, this.buildContext);
    }

    return pageMarkdown;
  }

  private async executeAfterHooks(pageMarkdown: string): Promise<string> {
    for (const afterHook of this.afterHooks) {
      pageMarkdown = await afterHook(pageMarkdown, this.buildContext);
    }

    return pageMarkdown;
  }
}
