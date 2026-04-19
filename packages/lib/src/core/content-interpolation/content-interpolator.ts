import path from "path";
import { BuildContext } from "../build-context";
import { StuartProject } from "../project";
import { ContextValueAccessor } from "./context-value-accessor";
import { IllegalOutOfProjectScopeAccess, IllegalOutOfScopeAccess } from "./errors";
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

  private static scopedPathRegex = new RegExp(`^${Token.prefixes.scopedPath}`);
  private static rootPathRegex = new RegExp(`^${Token.prefixes.rootPath}`);

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
   * Transforms tokens of the RootPath type into their root publish path.
   *
   * @example
   * ```markdown
   * <project-root>/content/animals/dogs/my-dog
   * This is a image in the root of the project of a dog: {~/image.jpg}
   *
   * <project-root>/publish/animals/dogs/my-dog
   * This is a image in the root of the project of a dog: ../../../image.jpg
   * ```
   */
  private handleRootPathToken(token: Token) {
    const absContentPath = this.project.getPublishPathForContent(this.buildContext.page.path);
    const relativeAssetsPath = path.relative(absContentPath, this.project.paths.publishedAssets);

    const illegalScopePath = `${Token.prefixes.rootPath}..`;

    if (token.value.startsWith(illegalScopePath)) {
      throw new IllegalOutOfProjectScopeAccess(token.value);
    }

    return token.value.replace(ContentInterpolator.rootPathRegex, relativeAssetsPath + "/");
  }

  /**
   * Transforms tokens of the ScopedPath type into their relative publish path.
   *
   * @example
   * ```markdown
   * This is a content-scoped image: {@/image.jpg}
   * This is a content-scoped image: ./image.jpg
   * ```
   */
  private handleScopedPathToken(token: Token) {
    const illegalScopePath = `${Token.prefixes.scopedPath}..`;

    if (token.value.startsWith(illegalScopePath)) {
      throw new IllegalOutOfScopeAccess(token.value);
    }

    return token.value.replace(ContentInterpolator.scopedPathRegex, "./");
  }

  private handleContextPropertyAccess(query: string) {
    return this.contextValueAccessor.get(query);
  }
}
