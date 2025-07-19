import fs from "fs/promises";
import path from "path";
import StuartProject from "..";
import BobLogger from "../../BobLogger";
import { CreateStuartProjectOptions } from "../types";

export default class StuartProjectCreate {
  private readonly logger = BobLogger.Instance;
  public constructor(private readonly options: CreateStuartProjectOptions) {}

  public async handle(): Promise<StuartProject | null> {
    const { projectName, projectDirectory, theme } = this.options;

    try {
      await this.createProjectDirectory();
      this.logger.logInfo(`Creating project directory at ${projectDirectory}`);

      await this.createIndexFile();
      this.logger.logInfo(`Created index file in ${projectDirectory}/pages`);
    } catch (error) {
      this.logger.logError(`Failed to create project:\n${(error as Error).message}`);
      fs.rm(projectDirectory, { recursive: true }).catch(() => {});
      return null;
    }

    return new StuartProject(projectName, projectDirectory, theme);
  }

  private async createProjectDirectory(): Promise<any> {
    return fs.mkdir(path.join(this.options.projectDirectory, "pages"), { recursive: true });
  }

  private async createIndexFile(): Promise<void> {
    const { projectName, projectDirectory } = this.options;

    return fs.copyFile(
      path.join(__dirname, "../templates", "index.md"),
      path.join(projectDirectory, "pages", "index.md")
    );
  }
}
