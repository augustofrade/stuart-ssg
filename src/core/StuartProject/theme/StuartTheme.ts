import { StuartThemeDefinition } from "./types";

export default class StuartTheme {
  private static instance: StuartTheme | null = null;

  private themeDefinition: StuartThemeDefinition | null = null;

  public setThemeDefinition(definition: StuartThemeDefinition): void {
    if (this.themeDefinition) return;
    this.themeDefinition = definition;
  }

  public get isLoaded(): boolean {
    return this.themeDefinition !== null;
  }

  public static get Instance(): StuartTheme {
    if (!StuartTheme.instance) {
      StuartTheme.instance = new StuartTheme();
    }
    return StuartTheme.instance;
  }
}
