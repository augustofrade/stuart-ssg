import { ResourceConfigSection } from "../../../types/resource-config.type";

export interface StuartThemeDefinition extends ResourceConfigSection {
  name: string;
  description: string;
  author: string;
  version: string;
  repository: string;
}
