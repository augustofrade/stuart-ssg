import fs from "fs/promises";
import path, { join } from "path";
import { Files } from "../files";
import { ProjectConfigurationParser } from "./project-configuration-parser";
import { ProjectData } from "./types";
import { validateProjectConfiguration } from "./validations/validate-project-configuration";
import { validateProjectConfigurationExistence } from "./validations/validate-project-configuration-existence";

export class StuartProject {
  private readonly categories: string[] = [];

  private constructor(
    public readonly root: string,
    public readonly data: ProjectData
  ) {
    // this.categories = new ProjectCategoriesMapper(projectRoot).map();
  }

  public static async init(projectRoot: string) {
    projectRoot = path.dirname(projectRoot); // remove file from path if any
    projectRoot = path.resolve(projectRoot); // make path absolute

    const projectConfigFile = join(projectRoot, Files.PROJECT_CONF);
    validateProjectConfigurationExistence(projectConfigFile);
    const rawProjectConfiguration = await fs.readFile(projectConfigFile, "utf-8");

    const parsedProjectData = new ProjectConfigurationParser().parse(rawProjectConfiguration);
    validateProjectConfiguration(parsedProjectData);

    // Project data is valid from now onwards
    const projectData = parsedProjectData as unknown as ProjectData;

    return new StuartProject(projectRoot, projectData);
  }
}
