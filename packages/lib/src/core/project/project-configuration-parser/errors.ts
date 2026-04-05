export class ProjectConfigurationParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectConfigurationParsingError";
  }
}
