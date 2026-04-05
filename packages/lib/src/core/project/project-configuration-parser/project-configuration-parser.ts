import { YamlParser } from "../../configurations/configuration-parser";
import { ProjectConfiguration } from "../types";
import { ProjectConfigurationParsingError } from "./errors";

export class ProjectConfigurationParser {
  public parse(rawProjectConfiguration: string): ProjectConfiguration {
    try {
      const result = new YamlParser().parse<ProjectConfiguration>(rawProjectConfiguration.trim());

      // Ensure that only data defined in these keys are used and available
      return {
        project: {
          name: result.project.name,
          author: result.project.author,
          theme: result.project.theme,
        },
        props: result.props,
      };
    } catch (e) {
      throw new ProjectConfigurationParsingError((e as Error).message);
    }
  }
}
