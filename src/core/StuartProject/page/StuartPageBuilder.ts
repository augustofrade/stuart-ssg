import fs from "fs/promises";
import { marked } from "marked";
import StuartProject from "..";
import BobLogger from "../../BobLogger";
import StuartPage from "../page/StuartPage";
import ThemeBuilder from "../theme/ThemeBuilder";

/**
 * Builder class for StuartPages.
 *
 * This class is responsible for loading, parsing, and building Stuart pages as well as
 * applying the current theme and every resource configuration values,
 * such as the project definitions.
 *
 * Serves as the main interface for page construction.
 */
export default class StuartPageBuilder {
  private page: StuartPage | null = null;
  private static readonly logger = BobLogger.Instance;
  private static parseMethod = (string: string) => marked(string, { async: true });

  public constructor() {}

  /**
   * Loads a page from the given file path.
   *
   * **Allows for chaining**
   *
   * @param fullPagePath - The absolute path to the page file.
   */
  public async loadPage(fullPagePath: string): Promise<this> {
    const pageContent = await fs.readFile(fullPagePath, "utf-8");
    this.page = new StuartPage(pageContent);

    return this;
  }

  /**
   * Parses the markdown content of the loaded page using the provided parse method.
   *
   * **Allows for chaining**
   */
  public async parseMarkdown(): Promise<this> {
    if (!this.page) {
      throw new Error("Page is not loaded. Call loadPage() first.");
    }

    StuartPageBuilder.logger.logVerbose(`Parsing markdown content: ${this.page.content}`);
    await this.page.parse(StuartPageBuilder.parseMethod);

    return this;
  }

  /**
   * Injects the current theme into the loaded page.
   *
   * **Allows for chaining**
   */
  public injectTheme(): this {
    if (!this.page) {
      throw new Error("Page is not loaded. Call loadPage() first.");
    }

    const theme = ThemeBuilder.Instance.themeContent;
    if (!theme) {
      throw new Error("Theme content is not loaded. Call loadCurrentTheme() first.");
    }

    this.page.injectTheme(theme);
    return this;
  }

  /**
   * Builds and injects all resource configuration values into the page content.
   *
   * @returns The final HTML content of the page.
   */
  public build(): string {
    if (!this.page) {
      throw new Error("Page is not loaded. Call loadPage() first.");
    }

    this.page.injectProps(StuartProject.Instance.configs?.project_definition ?? {});

    const pageProps = this.page.configs?.page_definition ?? {};
    this.page.injectProps(pageProps);
    StuartPageBuilder.logger.logVerbose(`Building theme with props: ${JSON.stringify(pageProps)}`);

    this.page.injectProps(StuartProject.Instance.configs?.props ?? {});

    this.page.lock();

    return this.page.content;
  }
}
