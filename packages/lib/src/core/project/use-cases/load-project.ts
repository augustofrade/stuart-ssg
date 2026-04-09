import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { Directories } from "../../directories";
import { Files } from "../../files";
import { LoadTheme, StuartTheme } from "../../theme";
import { ProjectConfigurationNotFoundError } from "../errors";
import { ProjectConfigurationParser } from "../project-configuration-parser";
import { StuartProject } from "../stuart-project";
import { ProjectData } from "../types";
import { validateProjectConfiguration } from "../validations/validate-project-configuration";

/**
 * Handles project loading, i.e. path resolving, validation and configuration parsing and validation
 */
export class LoadProject {
  private constructor() {}

  /**
   * Loads a project located in the passed _projectRoot_ path.
   * Accepts either the directory or the stuartconf.yaml file path itself.
   *
   * @param projectRoot Path to the Project Root
   * @returns
   */
  public static async handle(projectRoot: string): Promise<StuartProject> {
    if (!projectRoot.endsWith(Files.PROJECT_CONF)) {
      projectRoot = path.join(projectRoot, Files.PROJECT_CONF);
    }
    projectRoot = path.resolve(projectRoot); // make path absolute

    this.assertConfigurationExistence(projectRoot);
    const rawProjectConfiguration = await fs.readFile(projectRoot, "utf-8");

    const parsedProjectData = new ProjectConfigurationParser().parse(rawProjectConfiguration);
    validateProjectConfiguration(parsedProjectData);

    // Project data is valid from now onwards
    const projectData = parsedProjectData as unknown as ProjectData;

    const themes = await this.loadInstalledThemes(projectRoot);

    return new StuartProject(projectRoot, projectData, themes);
  }
  private static async loadInstalledThemes(projectRoot: string): Promise<StuartTheme[]> {
    // remove file from path and move inside themes folder
    projectRoot = path.join(path.dirname(projectRoot), Directories.THEMES);

    const installedThemes: StuartTheme[] = [];

    const themeDirs = await fs.readdir(projectRoot);
    for (const themeDir of themeDirs) {
      const theme = await LoadTheme.handle(path.join(projectRoot, themeDir));
      installedThemes.push(theme);
    }

    return installedThemes;
  }

  private static assertConfigurationExistence(projectConfigFile: string) {
    if (!existsSync(projectConfigFile))
      throw new ProjectConfigurationNotFoundError(projectConfigFile);
  }
}
