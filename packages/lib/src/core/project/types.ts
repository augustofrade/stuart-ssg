import { ConfigurationValue } from "../configurations/configuration-parser/types";

export interface ProjectConfiguration {
  name: string;
  author: string;
  theme: string;
}

export interface ProjectData<TProps = Record<string, ConfigurationValue>> {
  configuration: ProjectConfiguration;
  props: TProps;
}
