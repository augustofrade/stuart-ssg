export type ResourceConfigValue = string | number | boolean;

export type ResourceConfigSection = Record<string, ResourceConfigValue>;

export interface ResourceConfig {
  [key: string]: ResourceConfigSection;
}
