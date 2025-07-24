import { join } from "path";
import BobLogger from "../../BobLogger";
import StuartPage from "../page/StuartPage";

export class StuartTemplateStore {
  private readonly logger = BobLogger.Instance;

  private templates: Record<string, string> = {};
  private fallbackTemplateHTML: string = "";

  constructor(private readonly fetchTemplateFn: (templatePath: string) => Promise<string>) {}

  public setFallbackTemplate(content: string) {
    this.fallbackTemplateHTML = content;
  }

  public setTemplate(filePath: string, content: string) {
    this.templates[filePath] = content;
  }

  public async getTemplate(stuartPage: StuartPage): Promise<string> {
    let fileName = stuartPage.path.withoutExtension();
    const parentPath = stuartPage.path.dirName();
    const pageType = stuartPage.type;

    // Homepage, can't be treated as any other type of page
    if (fileName === "index") {
      fileName = join("templates", "home.html");
    } else if (pageType === "single") {
      fileName = join("templates", parentPath, "single.html");
    } else if (pageType === "archive") {
      fileName = join("templates", parentPath, "archive.html");
    }

    this.logger.logDebug("Looking for template: " + fileName);

    if (this.templates[fileName]) {
      return this.templates[fileName];
    }

    try {
      const content = await this.fetchTemplateFn(fileName);
      this.setTemplate(fileName, content);
      return content;
    } catch {
      this.logger.logVerbose(`Template not found: ${fileName}. Using fallback.`);
      return this.fallbackTemplateHTML;
    }
  }

  public get cacheSize(): number {
    return Object.keys(this.templates).length;
  }
}
