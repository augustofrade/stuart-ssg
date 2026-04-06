import { Unknown } from "../../../shared/types";
import { ProjectConfiguration } from "../types";

export interface UnknownProjectData {
  project: Unknown<ProjectConfiguration>;
  props: unknown;
}

export interface ParsedProjectData {
  configuration: Unknown<ProjectConfiguration>;
  props: unknown;
}
