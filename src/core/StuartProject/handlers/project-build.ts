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

export default class StuartProjectBuild {
  private readonly logger = BobLogger.Instance;
  private readonly results: BuildResults = {
    finished: false,
    pagesBuilt: 0,
    failures: 0,
  };

  public constructor(
    private readonly buildPath: string,
    private readonly buildPageFn: (pagePath: string) => Promise<StuartPage>
  ) {}

  public async handle(): Promise<BuildResults> {
    try {
      await StuartThemeManager.Instance.loadCurrentTheme();
    } catch (error) {
      this.logger.logError((error as Error).message);
      return this.results;
    }

    await this.ensureBuildDirectoryExists();
    const pagesPath = path.join(StuartProject.Instance.projectDirectory, "pages");
    const pages = await readDirectoryRecursively(pagesPath);

    for (const pagePath of pages) {
      try {
        const page = await this.buildPage(pagePath);
        this.logger.logInfo(chalk.green(`Built page: ${pagePath}\n`));

        await this.writeBuiltPageFile(page);

        this.results.pagesBuilt++;
      } catch (error) {
        this.logger.logError((error as Error).message);
        this.results.failures++;
      }
    }

    this.results.finished = true;
    return this.results;
  }

  private async ensureBuildDirectoryExists(): Promise<void> {
    await fs.mkdir(this.buildPath, { recursive: true });
  }

  private async buildPage(pagePath: string): Promise<StuartPage> {
    try {
      const page = await this.buildPageFn(pagePath);
      return page;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to build page: " + pagePath);
    }
  }

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
