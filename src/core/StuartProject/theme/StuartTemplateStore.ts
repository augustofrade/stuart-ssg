import chalk from "chalk";
import BobLogger from "../../BobLogger";
import { StuartPageFile } from "../page/types";

export class StuartTemplateStore {
  private static readonly logger = BobLogger.Instance;

  private templates: Record<string, string> = {};
  private fallbackTemplateHTML: string = "";

  constructor(private readonly fetchTemplateFn: (templatePath: string) => Promise<string>) {}

  public setFallbackTemplate(content: string) {
    this.fallbackTemplateHTML = content;
  }

  public setTemplate(filePath: string, content: string) {
    this.templates[filePath] = content;
  }

  public async getTemplate(file: StuartPageFile): Promise<string> {
    const { fileName, parentPath } = file;
    console.log(chalk.blue(fileName + " from " + parentPath + " of type " + file.pageType));
    console.log(this.templates);
    if (fileName === "index.html") {
      return this.fallbackTemplateHTML;
    }

    if (this.templates[fileName]) {
      return this.templates[fileName];
    }

    try {
      const content = await this.fetchTemplateFn(fileName);
      this.setTemplate(fileName, content);
      return content;
    } catch {
      StuartTemplateStore.logger.logVerbose(`Template not found: ${fileName}. Using fallback.`);
      return this.fallbackTemplateHTML;
    }
  }

  public get cacheSize(): number {
    return Object.keys(this.templates).length;
  }
}
