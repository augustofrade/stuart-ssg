import StuartProject from ".";
import StuartPageBuilder from "./builders/StuartPageBuilder";
import StuartProjectCreate from "./handlers/project-create";
import ThemeBuilder from "./stuart-theme/ThemeBuilder";
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
    await ThemeBuilder.Instance.loadCurrentTheme();
    return StuartProjectManager.buildPage(fullPagePath);
  }

  private static async buildPage(fullPagePath: string): Promise<string> {
    const pageBuilder = await new StuartPageBuilder().loadPage(fullPagePath);
    await pageBuilder.parseMarkdown();
    return pageBuilder.injectTheme().build();
  }
}
