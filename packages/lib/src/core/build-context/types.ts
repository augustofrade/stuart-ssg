import { PageFrontmatter } from "../page";
import { ProjectConfiguration } from "../project";
import { ContentNodePage } from "../project/project-content-mapper";
import { ThemeAuthor } from "../theme";

export interface ContextPageBuildParams {
  node: ContentNodePage;
  frontmatter: PageFrontmatter;
}

export interface ContextPageVars extends PageFrontmatter {
  category: string;
}

export interface ContextThemeVars {
  name: string;
  version: string;
  license: string;
  homepage: string;
  author: ThemeAuthor;
}

export interface ContextProjectVars<TProps> extends Omit<ProjectConfiguration, "theme"> {
  props: TProps;
}
