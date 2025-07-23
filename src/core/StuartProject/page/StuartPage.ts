import ConfigFile from "../../../helpers/ConfigFile";
import { ResourceConfig, ResourceConfigSection } from "../../../types/resource-config.type";
import StuartPagePath from "./StuartPagePath";
import { StuartPageDefinition, StuartPageType } from "./types";

export default class StuartPage {
  public readonly configs: ResourceConfig;
  public content: string;
  private built: boolean = false;

  public readonly path: StuartPagePath = new StuartPagePath(this.projectPagePath);

  public constructor(
    public readonly projectPagePath: string,
    pageContent: string
  ) {
    const lines = pageContent.split("\n");
    const [config, startOfFile] = this.parsePageDefinition(lines);
    this.configs = config;
    this.content = lines.slice(startOfFile + 1).join("\n");
  }

  public get type(): StuartPageType {
    return this.configs.page_definition.page_type.toString() as StuartPageType;
  }

  private parsePageDefinition(lines: string[]): [ResourceConfig, number] {
    const pageDefinition: StuartPageDefinition = {
      page_description: "",
      page_name: "",
      page_type: "page",
    };

    const start = lines.indexOf("[PAGE_DEFINITION]");
    const end = lines.indexOf("[PAGE]", start);
    if (start === -1 || end === -1) {
      return [{ page_definition: pageDefinition }, 0];
    }

    let rawConfig = lines
      .slice(start, end)
      .filter((line) => line.trim() !== "")
      .join("\n");

    if (rawConfig === "") {
      return [{ page_definition: pageDefinition }, 0];
    }

    const pageProps = ConfigFile.parse(rawConfig);
    if (!pageProps.page_definition) {
      pageProps.page_definition = pageDefinition;
    } else if (
      pageProps.page_definition.page_type !== "single" &&
      pageProps.page_definition.page_type !== "archive"
    ) {
      pageProps.page_definition.page_type = "page";
    }

    return [pageProps, end];
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

  public injectProps(props: ResourceConfigSection): this {
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
