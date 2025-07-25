import chalk from "chalk";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import ConfigFile from "../../../helpers/ConfigFile";
import { ResourceConfig } from "../../../types/resource-config.type";
import BobLogger from "../../BobLogger";

export interface CreateStuartProjectOptions {
  projectName: string;
  projectDirectory: string;
  blueprint: string;
  theme: string;
}

/**
 * Command handler of StuartProjectManager for creating a new Stuart project.
 * It creates a new project using the specified blueprint
 * and sets the specified values, such as the theme.
 */
export default class StuartProjectCreate {
  private readonly logger = BobLogger.Instance;
  private readonly BLUEPRINTS_DIR = path.join(__dirname, "../../../../stuart-data/blueprints");
  private readonly THEMES_DIR = path.join(__dirname, "../../../../stuart-data/themes");

  /**
   * @param options - The options for creating the project.
   */
  public constructor(private readonly options: CreateStuartProjectOptions) {}

  /**
   * Handles the creation of a new Stuart project by creating the project directory and setting
   * everything up according to what was specified in the options and is needed for a valid Stuart project.
   *
   * @returns Whether the project was successfully created or not.
   */
  public async handle(): Promise<boolean> {
    const { projectDirectory, theme, blueprint } = this.options;

    try {
      await this.createProjectDirectory();
      this.logger.logInfo(`Creating project directory at ${projectDirectory}`);

      await this.useBlueprint();
      this.logger.logInfo(`Using blueprint ${chalk.blue(blueprint)}`);

      await this.useTheme();
      this.logger.logInfo(`Set theme to ${chalk.blue(theme)}`);
      return true;
    } catch (error) {
      this.logger.logError(`Failed to create project:\n${(error as Error).message}`);
      fs.rm(projectDirectory, { recursive: true }).catch(() => {});
      return false;
    }
  }

  /**
   * Creates the project directory.
   */
  private async createProjectDirectory(): Promise<void> {
    // TODO: change the name of the method and verify whether the directory is empty
    await fs.mkdir(path.join(this.options.projectDirectory, "pages"), { recursive: true });
  }

  /**
   * Verifies the specified blueprint and copies its files to the project directory.
   *
   * Blueprints are located under `stuart-data/blueprints` directory.
   *
   * Can be used before or after theme setting.
   */
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

  /**
   * Verifies the specified theme and copies its files to the project directory.
   *
   * Themes are located under `stuart-data/themes` directory.
   */
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

  /**
   * Retrieves the resource configuration for the specified component.
   *
   * @param component The type of component (blueprint or theme).
   * @param componentName The name of the component.
   * @param componentPath The path to the component's directory.
   * @returns The resource configuration of the component.
   */
  private async getConfigFile(
    component: "blueprint" | "theme",
    componentName: string,
    componentPath: string
  ): Promise<ResourceConfig> {
    if (existsSync(componentPath) === false) {
      throw new Error(`${component} ${componentName} does not exist`);
    }

    const file = component === "blueprint" ? "stuart.conf" : "theme.conf";
    const config = await ConfigFile.read(path.join(componentPath, file));
    return config;
  }
}
