import fs from "fs/promises";
import path from "path";
import BobLogger from "../../BobLogger";
import { CreateStuartProjectOptions } from "../types";

export default class StuartProjectCreate {
  private readonly logger = BobLogger.Instance;
  public constructor(private readonly options: CreateStuartProjectOptions) {}

  public async handle(): Promise<boolean> {
    const { projectName, projectDirectory, theme } = this.options;

    // TODO: create blueprint usage
    try {
      await this.createProjectDirectory();
      this.logger.logInfo(`Creating project directory at ${projectDirectory}`);

      await this.createIndexFile();
      this.logger.logInfo(`Created index file in ${projectDirectory}/pages`);

      await this.createConfigFile();
      this.logger.logInfo(`Created configuration file at ${projectDirectory}/stuart.conf`);

      // TODO: copy theme folder
    } catch (error) {
      this.logger.logError(`Failed to create project:\n${(error as Error).message}`);
      fs.rm(projectDirectory, { recursive: true }).catch(() => {});
      return true;
    }

    return true;
  }

  private async createProjectDirectory(): Promise<any> {
    return fs.mkdir(path.join(this.options.projectDirectory, "pages"), { recursive: true });
  }

  private async createIndexFile(): Promise<void> {
    const { projectDirectory } = this.options;

    return fs.copyFile(
      path.join(__dirname, "../templates", "index.md"),
      path.join(projectDirectory, "pages", "index.md")
    );
  }

  private async createConfigFile(): Promise<void> {
    const { projectName, projectDirectory, theme } = this.options;

    let config = await fs.readFile(path.join(__dirname, "../templates", "stuart.conf"), "utf8");
    config = config.replace("PROJECT_NAME", projectName).replace("THEME", theme);

    await fs.writeFile(path.join(projectDirectory, "stuart.conf"), config, "utf8");
  }
}
