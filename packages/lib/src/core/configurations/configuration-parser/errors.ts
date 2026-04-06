export class ConfigurationParsingError extends Error {
  constructor(line: number, text: string) {
    super(`Malformed YAML syntax in line ${line}:\n${text}`);
    this.name = "ConfigurationParsingError";
  }
}

export class EmptyConfigurationError extends Error {
  constructor() {
    super("Unexpected empty configuration");
    this.name = "ConfigurationParsingError";
  }
}
