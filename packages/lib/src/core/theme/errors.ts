import { Files } from "../files";

export class ThemeConfigurationNotFoundError extends Error {
  constructor(directory: string) {
    super(`${Files.THEME_CONF} not found. Searched for ${directory}`);
    this.name = "ThemeConfigurationNotFoundError";
  }
}
