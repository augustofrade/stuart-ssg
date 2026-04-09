import path from "path";
import { StuartTheme } from "../stuart-theme";

import { existsSync } from "fs";
import fs from "fs/promises";
import { Files } from "../../files";
import { ThemeConfigurationNotFoundError } from "../errors";
import { ThemeConfigurationParser } from "../theme-configuration-parser";
import { ThemeConfiguration } from "../types";
import { validateThemeConfiguration } from "../validations/validate-theme-configuration";

/**
 * Handles theme loading, i.e. path resolving, validation and configuration parsing and validation
 */
export class LoadTheme {
  private constructor() {}

  /**
   * Loads a theme located in the passed _themeRoot_ path.
   * Accepts either the directory or the themeconf.yaml file path itself.
   *
   * @param themeRoot Path to the Theme Root
   * @returns
   */
  public static async handle(themeRoot: string): Promise<StuartTheme> {
    if (!themeRoot.endsWith(Files.THEME_CONF)) {
      themeRoot = path.join(themeRoot, Files.THEME_CONF);
    }
    themeRoot = path.resolve(themeRoot); // make path absolute

    this.assertConfigurationExistence(themeRoot);

    const rawThemeConfiguration = await fs.readFile(themeRoot, "utf-8");

    const parsedThemeConfiguration = new ThemeConfigurationParser().parse(rawThemeConfiguration);
    validateThemeConfiguration(parsedThemeConfiguration);

    // Theme configuration is valid from now onwards
    const themeConfiguration = parsedThemeConfiguration as unknown as ThemeConfiguration;

    return new StuartTheme(themeRoot, themeConfiguration);
  }

  private static assertConfigurationExistence(themeConfigFile: string) {
    if (!existsSync(themeConfigFile)) throw new ThemeConfigurationNotFoundError(themeConfigFile);
  }
}
