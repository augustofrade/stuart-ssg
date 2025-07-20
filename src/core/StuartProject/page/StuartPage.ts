import ConfigFile from "../../../helpers/ConfigFile";
import { ResourceConfig } from "../../../types/resource-config.type";

export default class StuartPage {
  public readonly configs: ResourceConfig;
  public content: string;
  private built: boolean = false;

  public constructor(pageContent: string) {
    const lines = pageContent.split("\n");
    const [config, startOfFile] = this.getPageDefinition(lines);
    this.configs = config;
    this.content = lines.slice(startOfFile + 1).join("\n");
  }

  private getPageDefinition(lines: string[]): [ResourceConfig, number] {
    const start = lines.indexOf("[PAGE_DEFINITION]");
    const end = lines.indexOf("[PAGE]", start);
    if (start === -1 || end === -1) {
      return [{}, 0];
    }

    let rawConfig = lines
      .slice(start, end)
      .filter((line) => line.trim() !== "")
      .join("\n");

    if (rawConfig === "") {
      return [{}, 0];
    }

    return [ConfigFile.parse(rawConfig), end];
  }

  public async parse(parseMethod: (string: string) => Promise<string>): Promise<this> {
    this.verifyPageStatus();

    if (!this.content) {
      throw new Error("Page content is empty. Cannot parse.");
    }

    this.content = await parseMethod(this.content);
    return this;
  }

  public injectTheme(themeHTML: string): this {
    this.verifyPageStatus();

    if (themeHTML.includes("%PAGE_CONTENT%") === false) {
      throw new Error("Passed theme HTML does not contain a placeholder for page content.");
    }
    this.content = themeHTML.replace("%PAGE_CONTENT%", this.content);
    return this;
  }

  public injectProps(props: Record<string, ResourceConfig>): this {
    this.verifyPageStatus();

    let builtTheme = this.content;
    for (const [key, value] of Object.entries(props)) {
      const placeholder = `%${key.toUpperCase()}%`;
      builtTheme = builtTheme.replace(new RegExp(placeholder, "g"), String(value));
    }
    this.content = builtTheme;

    return this;
  }

  public lock() {
    this.built = true;
  }

  private verifyPageStatus() {
    if (this.built) {
      throw new Error("Page has already been built.");
    }
  }
}
