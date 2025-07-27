import fs from "fs/promises";
import { join } from "path";
import StuartProject, { StuartProjectConfig } from ".";
import ConfigFile from "../../helpers/ConfigFile";
import getAbsolutePath from "../../helpers/get-absolute-path";
import BobLogger from "../BobLogger";
import StuartProjectBuild, { BuildResults } from "./handlers/project-build";
import StuartProjectCreate, { CreateStuartProjectOptions } from "./handlers/project-create";
import StuartPage from "./page/StuartPage";
import StuartPageBuilder from "./page/StuartPageBuilder";
import StuartThemeManager from "./theme/StuartThemeManager";

/**
 * Main class for Stuart Project related operations.
 */
export default class StuartProjectManager {
  private static readonly logger = BobLogger.Instance;

  /**
   * Loads a Stuart project on the specified directory.
   *
   * @param directory - The path to the directory where the Stuart project is located.
   * @returns Whether the project was successfully loaded or not.
   */
  public static async loadProject(directory: string): Promise<boolean> {
    // TODO: check if the directory is a valid Stuart project directory
    const project = StuartProject.Instance;
    project.projectDirectory = directory;
    try {
      const configFilePath = `${directory}/stuart.conf`;
      const configs = await ConfigFile.read(configFilePath);
      project.init(configs as StuartProjectConfig);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a new Stuart project.
   */
  public static async create(options: CreateStuartProjectOptions): Promise<boolean> {
    return new StuartProjectCreate(options).handle();
  }

  // TODO: improve method for nested categories and cache
  public static async getCategories(): Promise<string[]> {
    const dirents = await fs.readdir(join(StuartProject.Instance.projectDirectory, "pages"), {
      withFileTypes: true,
    });
    return dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  }

  /**
   * Builds the Stuart project and saves the built pages and static content to the specified build path.
   *
   * A Stuart project must be initialized with **StuartProjectManager.loadProject(...)** before calling this method.
   *
   * @param buildPath - The path where the built project will be saved
   * @returns The results of the build process
   */
  public static async buildProject(buildPath: string): Promise<BuildResults> {
    buildPath = getAbsolutePath(buildPath);
    return new StuartProjectBuild(buildPath, this.buildPage.bind(this)).handle();
  }

  /**
   * Handles the building of a single page in the Stuart project.
   *
   * This method is used for building a single page outside of the full project build process.
   * It doesn't handle static content copying, only theme and props injection,
   * as it uses the same page building function as the full project build process
   * from StuartProjectManager.buildProject(...).
   *
   * @param pagePath - The path of the page to be built, relative to the `<project>/pages` directory.
   */
  public static async buildSinglePage(pagePath: string): Promise<string | null> {
    try {
      await StuartThemeManager.Instance.loadCurrentTheme();
      const page = await StuartProjectManager.buildPage(pagePath);
      return page.content;
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  }

  /**
   * Builds a single page.
   *
   * This method should only be called **after** the theme has been loaded,
   * as it relies on the theme being available for the template injection operation.
   *
   * @param pagePath - The path of the page to be built, relative to the `<project>/pages` directory.
   * @returns - The built StuartPage object.
   */
  private static async buildPage(pagePath: string): Promise<StuartPage> {
    const pageBuilder = await new StuartPageBuilder(pagePath).loadPage();
    await pageBuilder.parseMarkdown();
    await pageBuilder.injectTheme();
    return pageBuilder.build();
  }
}
