export class Token {
  public static readonly prefixes = Object.freeze({
    project: "project.",
    page: "page.",
    theme: "theme.",
    rootPath: "@site/",
    scopedPath: "@page/",
    themeAssetsPath: "@theme/",
  });

  public constructor(public readonly value: string) {}

  public isProject() {
    return this.value.startsWith(Token.prefixes.project);
  }

  public isPage() {
    return this.value.startsWith(Token.prefixes.page);
  }

  public isTheme() {
    return this.value.startsWith(Token.prefixes.theme);
  }

  public isRootPath() {
    return this.value.startsWith(Token.prefixes.rootPath);
  }

  public isScopedPath() {
    return this.value.startsWith(Token.prefixes.scopedPath);
  }

  public isContentData() {
    return this.value === "content";
  }
}
