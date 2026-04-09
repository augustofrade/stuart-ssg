import { ThemeConfiguration } from "./types";

export class StuartTheme {
  public constructor(
    public readonly root: string,
    public readonly configuration: ThemeConfiguration
  ) {}
}
