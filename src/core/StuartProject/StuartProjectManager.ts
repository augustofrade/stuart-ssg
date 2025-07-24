import StuartProject, { StuartProjectConfig } from ".";
import ConfigFile from "../../helpers/ConfigFile";
import getAbsolutePath from "../../helpers/get-absolute-path";
import BobLogger from "../BobLogger";
import StuartProjectBuild, { BuildResults } from "./handlers/project-build";
import StuartProjectCreate from "./handlers/project-create";
import StuartPage from "./page/StuartPage";
import StuartPageBuilder from "./page/StuartPageBuilder";
import StuartThemeManager from "./theme/StuartThemeManager";
import { CreateStuartProjectOptions } from "./types";

export default class StuartProjectManager {
  private static readonly logger = BobLogger.Instance;

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

  public static async create(options: CreateStuartProjectOptions): Promise<boolean> {
    return new StuartProjectCreate(options).handle();
  }

  public static async buildProject(buildPath: string): Promise<BuildResults> {
    buildPath = getAbsolutePath(buildPath);
    return new StuartProjectBuild(buildPath, this.buildPage.bind(this)).handle();
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
