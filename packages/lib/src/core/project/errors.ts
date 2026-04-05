import { Files } from "../files";

export class ProjectConfigurationNotFoundError extends Error {
  constructor(directory: string) {
    super(`${Files.PROJECT_CONF} not found. Searched for in ${directory}`);
    this.name = "ProjectConfigurationNotFoundError";
  }
}
