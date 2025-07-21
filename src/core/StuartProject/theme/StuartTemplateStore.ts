import BobLogger from "../../BobLogger";

export class StuartTemplateStore {
  private static readonly logger = BobLogger.Instance;

  private templates: Record<string, string> = {};
  private fallbackTemplate: string = "";

  constructor(private readonly fetchTemplateFn: (templatePath: string) => Promise<string>) {}

  public setFallbackTemplate(content: string) {
    this.fallbackTemplate = content;
  }

  public setTemplate(filePath: string, content: string) {
    this.templates[filePath] = content;
  }

  public async getTemplate(filePath: string): Promise<string> {
    if (filePath === "index.html") {
      return this.fallbackTemplate;
    }

    if (this.templates[filePath]) {
      return this.templates[filePath];
    }

    try {
      const content = await this.fetchTemplateFn(filePath);
      this.setTemplate(filePath, content);
      return content;
    } catch {
      StuartTemplateStore.logger.logVerbose(`Template not found: ${filePath}. Using fallback.`);
      return this.fallbackTemplate;
    }
  }

  public get cacheSize(): number {
    return Object.keys(this.templates).length;
  }
}
