import { YamlParser } from "../../configurations/configuration-parser";
import {
  assertIsNullableObjectProp,
  assertObjectProp,
} from "../../configurations/validate-configuration/assertions";
import { ProjectConfigurationParsingError } from "./errors";
import { ParsedProjectData, UnknownProjectData } from "./types";

export class ProjectConfigurationParser {
  public parse(rawProjectConfiguration: string): ParsedProjectData {
    try {
      const result = new YamlParser().parse<UnknownProjectData>(rawProjectConfiguration.trim());
      assertObjectProp("project", "ProjectConfiguration", result.project);
      assertIsNullableObjectProp("props", result.props);

      return {
        configuration: result.project,
        props: result?.props ?? {},
      };
    } catch (e) {
      throw new ProjectConfigurationParsingError((e as Error).message);
    }
  }
}
