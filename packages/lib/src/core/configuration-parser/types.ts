export type ConfigurationValue = unknown;

export interface Configuration {
  [key: string]: ConfigurationValue;
}

/**
 * Parses configuration data. Does not handle file operations.
 */
export interface ConfigurationParser {
  /**
   * Parses a raw content into **Configuration** type
   *
   * @throws ConfigurationParsingError if configuration data is invalid
   * @param rawContent
   */
  parse(rawContent: string): Configuration;
}
