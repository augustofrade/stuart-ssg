import { YamlParser } from "../../configurations/configuration-parser";
import { ThemeConfigurationParsingError } from "./errors";
import { UnknownThemeConfiguration } from "./types";

export class ThemeConfigurationParser {
  public parse(rawThemeConfiguration: string): UnknownThemeConfiguration {
    try {
      const result = new YamlParser().parse<UnknownThemeConfiguration>(
        rawThemeConfiguration.trim()
      );

      return result;
    } catch (e) {
      throw new ThemeConfigurationParsingError((e as Error).message);
    }
  }
}
