import fs from "fs/promises";
import path from "path";
import StuartProject from "..";
import BobLogger from "../../BobLogger";

export default class StuartThemeManager {
  private readonly logger = BobLogger.Instance;
  private static instance: StuartThemeManager;
  public themeContent: string | null = null;

  public async loadCurrentTheme(): Promise<this> {
    const theme = StuartProject.Instance.configs?.project_definition?.theme as string | undefined;
    this.logger.logVerbose(`Loading theme: ${theme}`);
    if (!theme) {
      throw new Error("Could not find theme in project configuration.");
    }

    this.logger.logVerbose(`Reading theme...`);

    // TODO: load css file based on md file name
    const themePath = path.join(StuartProject.Instance.projectDirectory, "themes", theme);
    const themeFile = path.join(themePath, "index.html");
    this.themeContent = await fs.readFile(themeFile, "utf-8");

    return this;
  }

  public static get Instance(): StuartThemeManager {
    if (!StuartThemeManager.instance) {
      StuartThemeManager.instance = new StuartThemeManager();
    }
    return StuartThemeManager.instance;
  }
}
