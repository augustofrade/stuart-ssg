import chalk from "chalk";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import ConfigFile from "../../../helpers/ConfigFile";
import BobLogger from "../../BobLogger";
import { CreateStuartProjectOptions } from "../types";

export default class StuartProjectCreate {
  private readonly logger = BobLogger.Instance.setLogLevel(2);
  private readonly BLUEPRINTS_DIR = path.join(__dirname, "../../../../blueprints");
  private readonly THEMES_DIR = path.join(__dirname, "../../../../themes");

  public constructor(private readonly options: CreateStuartProjectOptions) {}

  public async handle(): Promise<boolean> {
    const { projectDirectory } = this.options;

    try {
      await this.createProjectDirectory();
      this.logger.logInfo(`Creating project directory at ${projectDirectory}`);

      await this.verifyAndCopyTheme();
      this.logger.logInfo(`Set theme to ${chalk.blue(this.options.theme)}`);

      await this.createIndexFile();
      this.logger.logInfo(`Created index file in ${projectDirectory}/pages`);

      await this.createConfigFile();
      this.logger.logInfo(`Created configuration file at ${projectDirectory}/stuart.conf`);

      // TODO: copy theme folder
    } catch (error) {
      this.logger.logError(`Failed to create project:\n${(error as Error).message}`);
      fs.rm(projectDirectory, { recursive: true }).catch(() => {});
      return false;
    }

    return true;
  }

  private async createProjectDirectory(): Promise<void> {
    await fs.mkdir(path.join(this.options.projectDirectory, "pages"), { recursive: true });
  }

  private async createIndexFile(): Promise<void> {
    const { projectDirectory } = this.options;
    const blueprintPath = this.getBlueprintPath(this.options.blueprint);

    await fs.copyFile(
      path.join(blueprintPath, "index.md"),
      path.join(projectDirectory, "pages", "index.md")
    );
  }

  private async createConfigFile(): Promise<void> {
    const { projectName, projectDirectory, theme } = this.options;
    const blueprintPath = this.getBlueprintPath(this.options.blueprint);

    let config = await fs.readFile(path.join(blueprintPath, "stuart.conf"), "utf8");
    config = config.replace("PROJECT_NAME", projectName).replace("THEME", theme);

    await fs.writeFile(path.join(projectDirectory, "stuart.conf"), config, "utf8");
  }

  private async verifyAndCopyTheme(): Promise<void> {
    const { theme } = this.options;

    this.logger.logDebug(`Verifying "${theme}" theme existence...`);

    const themePath = path.join(this.THEMES_DIR, theme.toLocaleLowerCase());
    if (existsSync(themePath) === false) {
      throw new Error(`Theme ${theme} does not exist at ${themePath}`);
    }

    const themeConf = await ConfigFile.read(path.join(themePath, "theme.conf"));
    if (typeof themeConf?.theme_definition?.name !== "string") {
      throw new Error(`Invalid theme configuration in ${themePath}`);
    }

    this.logger.logDebug(`Copying theme ${theme} from ${themePath}`);
    const destination = path.join(
      this.options.projectDirectory,
      "themes",
      theme.toLocaleLowerCase()
    );
    await fs.mkdir(destination, { recursive: true });
    await fs.cp(themePath, destination, {
      recursive: true,
    });
  }

  private getBlueprintPath(blueprint: string): string {
    return path.join(this.BLUEPRINTS_DIR, blueprint);
  }
}
