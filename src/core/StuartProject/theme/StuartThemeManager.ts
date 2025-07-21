import fs from "fs/promises";
import path from "path";
import StuartProject from "..";
import ConfigFile from "../../../helpers/ConfigFile";
import BobLogger from "../../BobLogger";
import { StuartTemplateStore } from "./StuartTemplateStore";
import StuartTheme from "./StuartTheme";
import { StuartThemeDefinition } from "./types";

export default class StuartThemeManager {
  private static instance: StuartThemeManager;

  private readonly logger = BobLogger.Instance;

  private themeDir = "";
  private templateStore = new StuartTemplateStore(this.readTemplateFile.bind(this));

  public async loadCurrentTheme(): Promise<this> {
    const theme = StuartProject.Instance.configs?.project_definition?.theme as string | undefined;
    if (!theme) {
      throw new Error("Could not find theme in project configuration.");
    }
    this.logger.logVerbose(`Verifying theme: ${theme}`);

    this.themeDir = path.join(StuartProject.Instance.projectDirectory, "themes", theme);

    this.cacheFallbackTemplate(this.themeDir);
    this.readThemeConfig(this.themeDir);

    return this;
  }

  public async getThemeTemplate(templatePath: string): Promise<string> {
    templatePath = templatePath.slice(0, templatePath.lastIndexOf(".")) + ".html";
    return this.templateStore.getTemplate(templatePath);
  }

  private async cacheFallbackTemplate(themeDir: string): Promise<void> {
    this.logger.logVerbose(`Verifying required fallback template in theme directory: ${themeDir}`);

    try {
      const fallbackTemplate = await fs.readFile(path.join(themeDir, "index.html"), "utf8");
      this.templateStore.setFallbackTemplate(fallbackTemplate);
    } catch (error) {
      throw new Error(`Invalid theme: fallback template not found in ${themeDir}`);
    }
  }

  private async readThemeConfig(themeDir: string): Promise<void> {
    this.logger.logVerbose(`Reading theme.conf in theme directory: ${themeDir}`);

    try {
      const themeConf = await ConfigFile.read(path.join(themeDir, "theme.conf"));
      StuartTheme.Instance.setThemeDefinition(themeConf as unknown as StuartThemeDefinition);
    } catch (error) {
      throw new Error(`Invalid theme: theme.conf file not found in ${themeDir}`);
    }
  }

  private async readTemplateFile(templatePath: string): Promise<string> {
    templatePath = templatePath.replace(this.themeDir, "");
    this.logger.logVerbose(
      `Template not in cache. Reading template file: ${templatePath} from theme...`
    );
    const templateContent = await fs.readFile(
      path.join(this.themeDir, "path", templatePath),
      "utf8"
    );
    return templateContent;
  }

  public static get Instance(): StuartThemeManager {
    if (!StuartThemeManager.instance) {
      StuartThemeManager.instance = new StuartThemeManager();
    }
    return StuartThemeManager.instance;
  }
}
