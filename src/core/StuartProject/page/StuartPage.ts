import ConfigFile from "../../../helpers/ConfigFile";
import { ResourceConfig, ResourceConfigSection } from "../../../types/resource-config.type";
import StuartPagePath from "./StuartPagePath";
import { StuartPageDefinition, StuartPageType } from "./types";

/**
 * Entity class that represents a page in a Stuart project.
 *
 * This means that this class is not responsible for and does not have any IO operations,
 * but rather for managing the page's content, status etc.
 */
export default class StuartPage {
  public readonly configs: ResourceConfig;
  public content: string;
  private built: boolean = false;

  /**
   * Path of the page.
   * Used to access the page's path properties with convenience methods.
   */
  public readonly path: StuartPagePath = new StuartPagePath(this.projectPagePath);

  /**
   * Creates an instance of StuartPage.
   * @param projectPagePath - The path of the page within the project starting from `pages` directory.
   * @param pageContent - The markdown content of the page.
   */
  public constructor(
    public readonly projectPagePath: string,
    pageContent: string
  ) {
    const lines = pageContent.split("\n");
    const [config, startOfFile] = this.parsePageDefinition(lines);
    this.configs = config;
    this.content = lines.slice(startOfFile + 1).join("\n");
  }

  /**
   * Convenience method to get the page's type.
   */
  public get type(): StuartPageType {
    return this.configs.page_definition.page_type.toString() as StuartPageType;
  }

  /**
   * Parses the page definition from the content.
   *
   * Page resources **must** be defined at the top of the page file and
   *  start with `[PAGE_DEFINITION]` and end with `[PAGE]`, signalizing that the markdown content follows.
   *
   * More sections, such as `[PROPS]`, can be added between both markers by the user.
   *
   * @returns A tuple containing the parsed page definition and the line number where the markdown content starts.
   */
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

  /**
   * Parses the page markdown content using the provided parse method.
   *
   * **Allows for chaining**
   *
   * @param parseMarkdownFn - A callback function that parses the markdown content.
   */
  public async parse(parseMarkdownFn: (string: string) => Promise<string>): Promise<this> {
    this.verifyPageStatus();

    if (!this.content) {
      throw new Error("Page content is empty. Cannot parse.");
    }

    this.content = await parseMarkdownFn(this.content);
    return this;
  }

  /**
   * Injects the HTML template of the theme into the page content.
   *
   * This method does not rely directly on StuartTheme as the page should not be aware of the current theme.
   *
   * **Allows for chaining**
   *
   * @param themeHTML - The HTML of the theme to be injected.
   */
  public injectTheme(themeHTML: string): this {
    this.verifyPageStatus();

    if (themeHTML.includes("%PAGE_CONTENT%") === false) {
      throw new Error("Passed theme HTML does not contain a placeholder for page content.");
    }
    this.content = themeHTML.replace("%PAGE_CONTENT%", this.content);
    return this;
  }

  /**
   * Injects the provided Resource values into the page content.
   *
   * **Allows for chaining**
   *
   * @param props The Resource values to be injected into the page content.
   */
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

  /**
   * Marks the page as locked, meaning it has been built and cannot be modified further.
   */
  public lock() {
    this.built = true;
  }

  /**
   * Convenience method to be used in other methods to check if the page has already been built.
   */
  private verifyPageStatus() {
    if (this.built) {
      throw new Error("Page has already been built.");
    }
  }
}
