import { StuartProject } from "../project";
import { StuartTheme } from "../theme";
import {
  ContextPageBuildParams,
  ContextPageVars,
  ContextProjectVars,
  ContextThemeVars,
} from "./types";

/**
 * Composition of different values of all parts required in order to build a Stuart Page:
 * - Page Frontmatter and additional data
 * - Project configuration and props
 * - Theme configuration
 */
export class BuildContext<TProps = Record<string, unknown>> {
  /**
   * Context vars related to the Stuart Page being built itself
   */
  public readonly page: ContextPageVars;
  /**
   * Context vars regarding the Stuart Project
   */
  public readonly project: ContextProjectVars<TProps>;
  /**
   * Context vars regarding the Stuart Theme
   */
  public readonly theme: ContextThemeVars;

  /**
   * Creates and maps a BuildContext consisting of values required in order to build a Stuart Page.
   */
  private constructor(page: ContextPageBuildParams, project: StuartProject, theme: StuartTheme) {
    this.page = this.mapPageContext(page);
    this.project = this.mapProjectContext(project);
    this.theme = this.mapThemeContext(theme);
  }

  private mapPageContext(page: ContextPageBuildParams): ContextPageVars {
    return {
      author: page.frontmatter.author,
      category: page.node.category,
      date: page.frontmatter.date,
      description: page.frontmatter.description,
      title: page.frontmatter.title,
      path: page.node.path,
    };
  }

  private mapProjectContext(project: StuartProject): ContextProjectVars<TProps> {
    return {
      author: project.data.configuration.author,
      name: project.data.configuration.name,
      props: structuredClone(project.data.props as TProps),
      categories: structuredClone(project.content.categories),
      path: project.root,
    };
  }

  private mapThemeContext(theme: StuartTheme): Readonly<ContextThemeVars> {
    return Object.freeze({
      author: theme.configuration.author,
      license: theme.configuration.license,
      name: theme.configuration.name,
      version: theme.configuration.version,
      homepage: theme.configuration.homepage ?? "",
    });
  }
}
