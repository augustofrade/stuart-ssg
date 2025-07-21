import StuartProject from ".";
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
      return false;
    }
  }

  public static async buildSinglePage(pagePath: string): Promise<string | null> {
    try {
      await StuartThemeManager.Instance.loadCurrentTheme();
      return StuartProjectManager.buildPage(pagePath);
      return "";
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
