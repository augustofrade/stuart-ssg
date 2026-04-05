import { ConfigurationValue } from "../configurations/configuration-parser/types";

export interface ProjectConfiguration<TProps = Record<string, ConfigurationValue>> {
  project: {
    name: string;
    author: string;
    theme: string;
  };
  props: TProps;
}
