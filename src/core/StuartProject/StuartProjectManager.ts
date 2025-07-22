import path from "path";
import StuartProject from ".";
import readDirectoryRecursively from "../../helpers/readDirectoryRecursively";
import BobLogger from "../BobLogger";
import StuartProjectCreate from "./handlers/project-create";
import StuartPageBuilder from "./page/StuartPageBuilder";
import StuartThemeManager from "./theme/StuartThemeManager";
import { CreateStuartProjectOptions } from "./types";

export default class StuartProjectManager {
  private static readonly logger = BobLogger.Instance.setLogLevel(2);
  public static async create(options: CreateStuartProjectOptions): Promise<boolean> {
    return new StuartProjectCreate(options).handle();
  }

  public static async loadProject(directory: string): Promise<boolean> {
    const project = StuartProject.Instance;
    project.projectDirectory = directory;
    try {
      await project.readConfigFile();
      return true;
    } catch (error) {
      this.logger.logError(
        `Project not found in directory: ${directory}. Looked for 'stuart.conf' file.`
      );
      return false;
    }
  }

  public static async buildProject(): Promise<void> {
    const pagesPath = path.join(StuartProject.Instance.projectDirectory, "pages");
    const pages = await readDirectoryRecursively(pagesPath);
    await StuartThemeManager.Instance.loadCurrentTheme();

    for (const page of pages) {
      const pageHTML = await StuartProjectManager.buildPage(page);
    }
  }

  public static async buildSinglePage(pagePath: string): Promise<string | null> {
    try {
      await StuartThemeManager.Instance.loadCurrentTheme();
      return StuartProjectManager.buildPage(pagePath);
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  }

  private static async buildPage(pagePath: string): Promise<string | null> {
    const pageBuilder = await new StuartPageBuilder(pagePath).loadPage();
    await pageBuilder.parseMarkdown();
    await pageBuilder.injectTheme();
    return pageBuilder.build();
  }
}
