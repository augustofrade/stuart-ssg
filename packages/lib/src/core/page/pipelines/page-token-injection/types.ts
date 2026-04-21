import { BuildContext } from "../../../build-context";

/**
 * Allows changes to the markdown content of the Stuart Page before any token injection is made in it.
 *
 * Expects a string, the markdown of the Stuart Page, to be returned.
 */
export type BeforePageTokenInjectionHook = (
  pageMarkdown: string,
  context: BuildContext
) => Promise<string>;

/**
 * Allows changes to the resulting Stuart Page's content after token injection.
 *
 * Expects a string, the markdown content, to be returned.
 */
export type AfterPageTokenInjectionHook = (
  pageMarkdown: string,
  context: BuildContext
) => Promise<string>;

export interface PageTokenInjectionPipelineResult {
  pageMarkdown: string;
}
