export type ResourceConfigValue = string | number | boolean;

export interface ResourceConfig {
  [key: string]: {
    [key: string]: ResourceConfigValue;
  };
}
