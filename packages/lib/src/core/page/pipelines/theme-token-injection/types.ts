import { BuildContext } from "../../../build-context";

/**
 * Allows changes to the HTML of the Stuart Theme before any token injection is made to it.
 *
 * Expects a string, the HTML of the Stuart Theme, to be returned.
 */
export type BeforeThemeTokenInjectionHook = (
  themeHtml: string,
  context: BuildContext
) => Promise<string>;

/**
 * Allows changes to the resulting Stuart Theme's HTML after token injection.
 *
 * Expects a string, the HTML, to be returned.
 */
export type AfterThemeTokenInjectionHook = (
  themeHtml: string,
  context: BuildContext
) => Promise<string>;

export interface ThemeTokenInjectionPipelineResult {
  themeHtml: string;
}
