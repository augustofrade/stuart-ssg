import chalk from "chalk";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import StuartProject, { StuartProjectConfig } from ".";
import ConfigFile from "../../helpers/ConfigFile";
import getAbsolutePath from "../../helpers/get-absolute-path";
import readDirectoryRecursively from "../../helpers/readDirectoryRecursively";
import BobLogger from "../BobLogger";
import StuartProjectCreate from "./handlers/project-create";
import StuartPage from "./page/StuartPage";
import StuartPageBuilder from "./page/StuartPageBuilder";
import StuartThemeManager from "./theme/StuartThemeManager";
import { CreateStuartProjectOptions } from "./types";

export default class StuartProjectManager {
  private static readonly logger = BobLogger.Instance;
  public static async create(options: CreateStuartProjectOptions): Promise<boolean> {
    return new StuartProjectCreate(options).handle();
  }

  public static async loadProject(directory: string): Promise<boolean> {
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

  public static async buildProject(outputDirectory: string): Promise<BuildResults> {
    const pagesPath = path.join(StuartProject.Instance.projectDirectory, "pages");
    const pages = await readDirectoryRecursively(pagesPath);
    try {
      await StuartThemeManager.Instance.loadCurrentTheme();
    } catch (error) {
      StuartProjectManager.logger.logError((error as Error).message);
      return { pagesBuilt: 0, failures: 0, finished: false };
    }

    const buildPath = getAbsolutePath(outputDirectory);
    if (!existsSync(outputDirectory)) {
      StuartProjectManager.logger.logInfo(
        `Output directory does not exist. Creating: ${buildPath}`
      );
      await fs.mkdir(buildPath, { recursive: true });
    }

    const results: BuildResults = {
      finished: false,
      pagesBuilt: 0,
      failures: 0,
    };

    for (const pageDir of pages) {
      let page: StuartPage;
      try {
        page = await StuartProjectManager.buildPage(pageDir);
      } catch {
        StuartProjectManager.logger.logError(`Failed to build page: ${pageDir}`);
        results.failures++;
        continue;
      }

      results.pagesBuilt++;
      StuartProjectManager.logger.logInfo(chalk.green(`Built page: ${pageDir}`));
      console.log("");

      const outputFilePath = path.join(buildPath, page.path.resultPath());
      const dir = path.dirname(outputFilePath);
      if (!existsSync(dir)) {
        await fs.mkdir(dir, { recursive: true });
      }
      await fs.writeFile(outputFilePath, page.content, "utf-8");
    }

    results.finished = true;
    return results;
  }

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

  private static async buildPage(pagePath: string): Promise<StuartPage> {
    const pageBuilder = await new StuartPageBuilder(pagePath).loadPage();
    await pageBuilder.parseMarkdown();
    await pageBuilder.injectTheme();
    return pageBuilder.build();
  }
}

interface BuildResults {
  finished: boolean;
  pagesBuilt: number;
  failures: number;
}
