import path from "path";
import { BuildContext } from "../build-context";
import { StuartProject } from "../project";
import { ContextValueAccessor } from "./context-value-accessor";
import {
  IllegalOutOfProjectScopeAccess,
  IllegalOutOfScopeAccess,
  InvalidContentInterpolationPipe,
} from "./errors";
import { ContentInterpolationPipes } from "./pipes";
import { Token } from "./token";
import { ContentInterpolationValue } from "./types";

/**
 * Handles Content Interpolation of BuildContext values in string content
 */
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
  private static tokenRegex = /\{\s?([^}]*)\s?\}/g;

  public handle(): string {
    return this.content.replace(
      ContentInterpolator.tokenRegex,
      (_, rawInterpolationValue: string) => {
        const value = rawInterpolationValue.trim();

        const [tokenValue, pipe] = value.split(" | ");
        const token = new Token(tokenValue ?? value);
        let valueResult = this.handleToken(token)?.toString() ?? "";

        if (pipe) {
          return this.handlePipedValue(value, pipe, rawInterpolationValue);
        }

        return valueResult;
      }
    );
  }

  private handleToken(token: Token): ContentInterpolationValue {
    if (token.isProject()) {
      return this.handleProjectToken(token);
    } else if (token.isTheme()) {
      return this.handleThemeToken(token);
    } else if (token.isRootPath()) {
      return this.handleRootPathToken(token);
    } else if (token.isPage()) {
      return this.handlePageToken(token);
    } else if (token.isScopedPath()) {
      return this.handleScopedPathToken(token);
    } else if (token.isContentData()) {
      return this.content;
    }

    return this.handleInvalidTokenWithFallback(token);
  }

  private handlePipedValue(value: string, pipe: string, rawInterpolationValue: string) {
    const pipeCallback = ContentInterpolationPipes.get(pipe);
    if (pipeCallback === undefined)
      throw new InvalidContentInterpolationPipe(pipe, rawInterpolationValue);

    return pipeCallback(value);
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
   * Defaults the invalid token to the "page" type, prefixing its query.
   *
   * @example
   * ```markdown
   * Page name is {title}
   *
   * Gets translated to:
   *
   * Page name is {page.title}
   * ```
   */
  private handleInvalidTokenWithFallback(token: Token) {
    return this.handleContextPropertyAccess(`${Token.prefixes.page}${token.value}`);
  }

  /**
   * Transforms tokens of the RootPath type into their root publish path.
   *
   * @example
   * ```markdown
   * source: <project-root>/content/animals/dogs/my-dog
   * This is a image in the root of the project of a dog: {~/image.jpg}
   *
   * result: <project-root>/publish/animals/dogs/my-dog
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

  /**
   * Generic context query handler method
   */
  private handleContextPropertyAccess(query: string) {
    return this.contextValueAccessor.get(query);
  }
}
