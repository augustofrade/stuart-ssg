import path from "path";
import { BuildContext } from "../build-context";
import { StuartProject } from "../project";
import { ContextValueAccessor } from "./context-value-accessor";
import { Token } from "./token";
import { ContentInterpolationValue } from "./types";

const tokenRegex = /\{([^}]*)\}/g;

export class ContentInterpolator {
  private readonly contextValueAccessor: ContextValueAccessor;

  public constructor(
    private readonly content: string,
    private readonly buildContext: BuildContext,
    private readonly project: StuartProject
  ) {
    this.contextValueAccessor = new ContextValueAccessor(buildContext);
  }

  public handle(): string {
    return this.content.replace(tokenRegex, (_, value: string) => {
      const token = new Token(value);
      let contextValue: ContentInterpolationValue = "";

      if (token.isProject()) {
        contextValue = this.handleProjectToken(token);
      } else if (token.isTheme()) {
        contextValue = this.handleThemeToken(token);
      } else if (token.isRootPath()) {
        contextValue = this.handleRootPathToken(token);
      } else if (token.isScopedPath()) {
        contextValue = this.handleScopedPathToken(token);
      } else {
        contextValue = this.handlePageToken(token);
      }

      return contextValue?.toString() ?? "";
    });
  }

  private handlePageToken(token: Token) {
    return this.handleContextPropertyAccess(token.value);
  }

  private handleProjectToken(token: Token) {
    return this.handleContextPropertyAccess(token.value);
  }

  private handleThemeToken(token: Token) {
    return this.handleContextPropertyAccess(token.value);
  }

  /**
   * Transforms tokens of the RootPath type into their absolute publish path
   */
  private handleRootPathToken(token: Token) {
    return this.handleGenericPath(token, Token.prefixes.rootPath);
  }

  /**
   * Transforms tokens of the ScopedPath type into their absolute publish path
   */
  private handleScopedPathToken(token: Token) {
    return this.handleGenericPath(token, Token.prefixes.scopedPath);
  }

  private handleGenericPath(token: Token, tokenPathPrefix: string) {
    // publish path of the content must be used otherwise static files won't be referenced
    const publishContentPath = this.project.getPublishPathForContent(this.buildContext.page.path);
    const regex = new RegExp(`^${tokenPathPrefix}`);
    const relativePath = token.value.replace(regex, "");
    return path.join(publishContentPath, relativePath);
  }

  private handleContextPropertyAccess(query: string) {
    return this.contextValueAccessor.get(query);
  }
}
