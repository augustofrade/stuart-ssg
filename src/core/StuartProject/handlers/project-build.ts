import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import StuartProject from "..";
import readDirectoryRecursively from "../../../helpers/readDirectoryRecursively";
import BobLogger from "../../BobLogger";
import StuartPage from "../page/StuartPage";
import StuartThemeManager from "../theme/StuartThemeManager";

export interface BuildResults {
  finished: boolean;
  pagesBuilt: number;
  failures: number;
}

/**
 * Command handler of StuartProjectManager for building the Stuart project.
 * It builds all pages and static content in the project using the specified callback and
 * saves them to the specified build path.
 */
export default class StuartProjectBuild {
  private readonly logger = BobLogger.Instance;
  private readonly results: BuildResults = {
    finished: false,
    pagesBuilt: 0,
    failures: 0,
  };

  /**
   * @param buildPath - The path where the built pages will be saved
   * @param buildPageFn - A callback function that handles the building of a single page.
   * A callback is used because **StuartProjectBuild** handler is part of StuartProjectManager,
   * thus there would be no sense in duplicating the page building logic here.
   */
  public constructor(
    private readonly buildPath: string,
    private readonly buildPageFn: (pagePath: string) => Promise<StuartPage>
  ) {}

  /**
   * Handles the build process of the project,
   * meaning that it will call the buildPage callback and save the results of each page in its corresponding .html file
   * as well as handle the static content of the selected theme in the project.
   *
   * @returns The results of the build process, including the number of pages built and any failures encountered
   */
  public async handle(): Promise<BuildResults> {
    try {
      await StuartThemeManager.Instance.loadCurrentTheme();
    } catch (error) {
      this.logger.logError((error as Error).message);
      return this.results;
    }

    const pages = await readDirectoryRecursively(StuartProject.Instance.paths.pages);

    await this.ensureBuildDirectoryExists();
    await this.copyStaticThemeContent();

    for (const pagePath of pages) {
      try {
        const page = await this.buildPage(pagePath);
        this.logger.logInfo(chalk.green(`Built page: ${pagePath}\n`));

        await this.writeBuiltPageFile(page);
        // TODO: handle static content copying

        this.results.pagesBuilt++;
      } catch (error) {
        this.logger.logError((error as Error).message);
        this.results.failures++;
      }
    }

    this.results.finished = true;
    return this.results;
  }

  /**
   * Creates the build directory if it does not exist.
   */
  private async ensureBuildDirectoryExists(): Promise<void> {
    await fs.mkdir(path.join(this.buildPath, "static"), { recursive: true });
  }

  private async copyStaticThemeContent(): Promise<void> {
    const currentTheme = StuartProject.Instance.configs?.project_definition?.theme as string;
    const originPath = path.join(StuartProject.Instance.paths.themes, currentTheme, "static");

    this.logger.logVerbose("Copying static content from theme directory");

    // TODO: apply CSS minification strategy
    for (const file of await fs.readdir(originPath, { recursive: true, withFileTypes: true })) {
      const destPath = path.join(this.buildPath, "static", file.name);

      if (file.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        continue;
      }
      await fs.cp(path.join(file.parentPath, file.name), destPath);
    }
  }

  /**
   * Calls the buildPage callback to build a single page.
   *
   * @param pagePath - The path starting from `<project>/pages/` of the page to be built.
   */
  private async buildPage(pagePath: string): Promise<StuartPage> {
    try {
      const page = await this.buildPageFn(pagePath);
      return page;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to build page: " + pagePath);
    }
  }

  /**
   * Writes the built page content to a file in its corresponding path in the build directory.
   *
   * Output page directory is the same as the root of the build directory,
   * meaning that page location is translated as from `<project>/pages/<page>.md` to `<buildPath>/<page>.html`.
   *
   * @param page - The StuartPage object that contains the content to be written to a file.
   */
  private async writeBuiltPageFile(page: StuartPage): Promise<void> {
    const outputFilePath = path.join(this.buildPath, page.path.resultPath());
    const dir = path.dirname(outputFilePath);
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(outputFilePath, page.content, "utf-8");
    } catch (error) {
      console.log(error);
      throw new Error("Failed to write page file: " + outputFilePath);
    }
  }
}
