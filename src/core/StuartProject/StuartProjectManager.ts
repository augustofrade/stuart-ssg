import StuartProject from ".";
import StuartPageBuilder from "./builders/PageBuilder";
import ThemeBuilder from "./builders/ThemeBuilder";
import StuartProjectCreate from "./handlers/project-create";
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

  public static async buildPage(fullPagePath: string): Promise<void> {
    await ThemeBuilder.Instance.loadCurrentTheme();
    const pageBuilder = await new StuartPageBuilder().loadPage(fullPagePath);
    await pageBuilder.parseMarkdown();
    pageBuilder.injectTheme().build();
  }
}
