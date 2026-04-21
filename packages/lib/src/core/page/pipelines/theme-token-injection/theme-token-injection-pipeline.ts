import { BuildContext } from "../../../build-context";
import { ContentInterpolator } from "../../../content-interpolation";
import { StuartProject } from "../../../project";
import { PageBuildPipelineStep } from "../page-build-pipeline-step";
import {
  AfterThemeTokenInjectionHook,
  BeforeThemeTokenInjectionHook,
  ThemeTokenInjectionPipelineResult,
} from "./types";

/**
 * Fourth sub-pipeline of the Page Building pipeline.
 * Handles content interpolation of all tokens in the Stuart Theme's HTML template.
 *
 * Returns the final HTML templated, ready to be be injected with the parsed HTML content of the Page.
 */
export class ThemeTokenInjectionPipeline extends PageBuildPipelineStep<
  BeforeThemeTokenInjectionHook,
  AfterThemeTokenInjectionHook
> {
  public constructor(
    private readonly buildContext: BuildContext,
    private readonly project: StuartProject
  ) {
    super();
  }

  public async handle(themeHtml: string): Promise<ThemeTokenInjectionPipelineResult> {
    themeHtml = await this.executeBeforeHooks(themeHtml);

    themeHtml = new ContentInterpolator(themeHtml, this.buildContext, this.project).handle();
    // TODO: handle error with new error type & bubbling

    themeHtml = await this.executeAfterHooks(themeHtml);

    return {
      themeHtml,
    };
  }

  private async executeBeforeHooks(themeHtml: string): Promise<string> {
    for (const beforeHook of this.beforeHooks) {
      themeHtml = await beforeHook(themeHtml, this.buildContext);
    }

    return themeHtml;
  }

  private async executeAfterHooks(themeHtml: string): Promise<string> {
    for (const afterHook of this.afterHooks) {
      themeHtml = await afterHook(themeHtml, this.buildContext);
    }

    return themeHtml;
  }
}
