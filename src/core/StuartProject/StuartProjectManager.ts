import StuartProject from ".";
import StuartProjectCreate from "./handlers/project-create";
import StuartPageBuilder from "./page/StuartPageBuilder";
import StuartThemeManager from "./theme/StuartThemeManager";
import { CreateStuartProjectOptions } from "./types";

export default class StuartProjectManager {
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

  public static async buildSinglePage(fullPagePath: string): Promise<string> {
    await StuartThemeManager.Instance.loadCurrentTheme();
    return StuartProjectManager.buildPage(fullPagePath);
  }

  private static async buildPage(fullPagePath: string): Promise<string> {
    const pageBuilder = await new StuartPageBuilder(fullPagePath).loadPage();
    await pageBuilder.parseMarkdown();
    return pageBuilder.injectTheme().build();
  }
}
