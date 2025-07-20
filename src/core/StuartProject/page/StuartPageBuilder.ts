import fs from "fs/promises";
import { marked } from "marked";
import StuartProject from "..";
import BobLogger from "../../BobLogger";
import StuartPage from "../page/StuartPage";
import ThemeBuilder from "../theme/ThemeBuilder";

export default class StuartPageBuilder {
  private page: StuartPage | null = null;
  private static readonly logger = BobLogger.Instance;
  private static parseMethod = (string: string) => marked(string, { async: true });

  public constructor() {}

  public async loadPage(fullPagePath: string): Promise<this> {
    const pageContent = await fs.readFile(fullPagePath, "utf-8");
    this.page = new StuartPage(pageContent);

    return this;
  }

  public async parseMarkdown(): Promise<this> {
    if (!this.page) {
      throw new Error("Page is not loaded. Call loadPage() first.");
    }

    StuartPageBuilder.logger.logVerbose(`Parsing markdown content: ${this.page.content}`);
    await this.page.parse(StuartPageBuilder.parseMethod);

    return this;
  }

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
