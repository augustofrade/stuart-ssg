import yaml, { YAMLException } from "js-yaml";
import { ConfigurationParsingError } from "./errors";
import { Configuration, ConfigurationParser } from "./types";

/**
 * Concrete implementation of ConfigurationParser.
 *
 * Parses YAML configuration data. Does not handle file operations.
 */
export class YamlParser implements ConfigurationParser {
  /**
   * Parses a raw content into **Configuration** type
   *
   * @throws ConfigurationParsingError if configuration data is invalid
   * @param rawContent
   */
  public parse(rawContent: string): Configuration {
    try {
      const data = yaml.load(rawContent.trim()) as Configuration;
      return data;
    } catch (e) {
      const yamlError = e as YAMLException;
      const line = yamlError.mark.line + 1;
      const text = yamlError.mark.snippet;
      throw new ConfigurationParsingError(`Malformed YAML syntax in line ${line}:\n${text}`);
    }
  }
}
