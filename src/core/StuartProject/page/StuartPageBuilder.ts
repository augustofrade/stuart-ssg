import fs from "fs/promises";
import { marked } from "marked";
import path from "path";
import StuartProject from "..";
import BobLogger from "../../BobLogger";
import StuartPage from "../page/StuartPage";
import StuartThemeManager from "../theme/StuartThemeManager";

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
  private static readonly logger = BobLogger.Instance;
  private page: StuartPage | null = null;
  private absolutePagePath: string;

  private static parseMethod = (string: string) => marked(string, { async: true });

  public constructor(private readonly projectPagePath: string) {
    this.absolutePagePath = path.join(StuartProject.Instance.paths.pages, this.projectPagePath);
  }

  /**
   * Loads the page corresponding to the file path passed into through the constructor.
   *
   * **Allows for chaining**
   */
  public async loadPage(): Promise<this> {
    StuartPageBuilder.logger.logInfo(`Starting page build: ${this.projectPagePath}`);

    const pageContent = await fs.readFile(this.absolutePagePath, "utf-8");
    this.page = new StuartPage(this.projectPagePath, pageContent);

    if (this.page.configs.page_definition?.page_name === "") {
      StuartPageBuilder.logger.logWarning(
        "Page name is empty. Pages should have a name defined in the [PAGE_DEFINITION] section."
      );
    }

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

    StuartPageBuilder.logger.logDebug("Parsing markdown content");
    await this.page.parse(StuartPageBuilder.parseMethod);

    return this;
  }

  /**
   * Injects the current theme into the loaded page.
   *
   * **Allows for chaining**
   */
  public async injectTheme(): Promise<this> {
    if (!this.page) {
      throw new Error("Page is not loaded. Call loadPage() first.");
    }

    const theme = await StuartThemeManager.Instance.getTemplateForPage(this.page);
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
  public build(): StuartPage {
    if (!this.page) {
      throw new Error("Page is not loaded. Call loadPage() first.");
    }

    this.page.injectProps(StuartProject.Instance.configs?.project_definition ?? {});

    const pageProps = this.page.configs?.page_definition ?? {};
    this.page.injectProps(pageProps);
    StuartPageBuilder.logger.logVerbose(
      `Building template with props: ${JSON.stringify(pageProps)}`
    );

    this.page.injectProps(StuartProject.Instance.configs?.props ?? {});

    this.page.lock();

    return this.page;
  }
}
