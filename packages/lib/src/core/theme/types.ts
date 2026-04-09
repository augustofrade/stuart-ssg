export interface ThemeAuthor {
  name: string;
  homepage: string;
}

export interface ThemeConfiguration {
  name: string;
  version: string;
  license: string;
  homepage?: string;
  author: ThemeAuthor;
}
