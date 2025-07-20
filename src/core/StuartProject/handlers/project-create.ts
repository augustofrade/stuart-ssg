import chalk from "chalk";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import ConfigFile, { Config } from "../../../helpers/ConfigFile";
import BobLogger from "../../BobLogger";
import { CreateStuartProjectOptions } from "../types";

export default class StuartProjectCreate {
  private readonly logger = BobLogger.Instance;
  private readonly BLUEPRINTS_DIR = path.join(__dirname, "../../../../stuart-data/blueprints");
  private readonly THEMES_DIR = path.join(__dirname, "../../../../stuart-data/themes");

  public constructor(private readonly options: CreateStuartProjectOptions) {}

  public async handle(): Promise<boolean> {
    const { projectDirectory, theme, blueprint } = this.options;

    try {
      await this.createProjectDirectory();
      this.logger.logInfo(`Creating project directory at ${projectDirectory}`);

      await this.useBlueprint();
      this.logger.logInfo(`Using blueprint ${chalk.blue(blueprint)}`);

      await this.useTheme();
      this.logger.logInfo(`Set theme to ${chalk.blue(theme)}`);
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

  private async useBlueprint(): Promise<void> {
    const { projectDirectory, blueprint, projectName, theme } = this.options;
    this.logger.logDebug(`Verifying "${blueprint}" blueprint...`);

    const blueprintPath = path.join(this.BLUEPRINTS_DIR, blueprint);

    const blueprintConf = await this.getConfigFile("blueprint", blueprint, blueprintPath);
    if (typeof blueprintConf?.project_definition?.project_name !== "string") {
      throw new Error(`Invalid blueprint configuration found in ${blueprintPath}`);
    }

    this.logger.logDebug(`Copying blueprint files to ${projectDirectory}...`);
    await fs.cp(blueprintPath, projectDirectory, { recursive: true });

    let config = await fs.readFile(path.join(blueprintPath, "stuart.conf"), "utf8");

    this.logger.logDebug(`Replacing blueprint placeholders in stuart.conf...`);
    config = config.replace("%PROJECT_NAME%", projectName).replace("%THEME%", theme);
    await fs.writeFile(path.join(projectDirectory, "stuart.conf"), config, "utf8");
  }

  private async useTheme(): Promise<void> {
    const { theme } = this.options;

    this.logger.logDebug(`Verifying "${theme}" theme...`);

    const themePath = path.join(this.THEMES_DIR, theme.toLocaleLowerCase());

    const themeConf = await this.getConfigFile("theme", theme, themePath);
    if (typeof themeConf?.theme_definition?.name !== "string") {
      throw new Error(`Invalid theme configuration found in ${themePath}`);
    }

    const destinationPath = path.join(
      this.options.projectDirectory,
      "themes",
      theme.toLocaleLowerCase()
    );

    this.logger.logDebug(`Copying theme files to ${destinationPath}`);
    await fs.mkdir(destinationPath, { recursive: true });
    await fs.cp(themePath, destinationPath, {
      recursive: true,
    });
  }

  private async getConfigFile(
    component: "blueprint" | "theme",
    componentName: string,
    componentPath: string
  ): Promise<Config> {
    if (existsSync(componentPath) === false) {
      throw new Error(`${component} ${componentName} does not exist`);
    }

    const file = component === "blueprint" ? "stuart.conf" : "theme.conf";
    const config = await ConfigFile.read(path.join(componentPath, file));
    return config;
  }
}
