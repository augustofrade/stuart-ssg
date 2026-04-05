import { existsSync } from "fs";
import { ProjectConfigurationNotFoundError } from "../errors";
export function validateProjectConfigurationExistence(projectConfigFile: string) {
  if (!existsSync(projectConfigFile))
    throw new ProjectConfigurationNotFoundError(projectConfigFile);
}
