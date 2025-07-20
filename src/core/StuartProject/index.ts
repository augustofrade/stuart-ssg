import ConfigFile from "../../helpers/ConfigFile";

/**
 * Singleton class containing the active project information
 */
export default class StuartProject {
  private static instance: StuartProject;

  public projectDirectory: string = "";
  public configs: StuartProjectConfig = {
    project_definition: {},
    props: {},
  };

  private constructor() {}

  public setConfigs(configs: StuartProjectConfig): this {
    this.configs = configs;
    return this;
  }

  public async readConfigFile() {
    // TODO: maybe move out of here
    const configFilePath = `${this.projectDirectory}/stuart.conf`;
    this.configs = (await ConfigFile.read(configFilePath)) as StuartProjectConfig;
  }

  public static get Instance() {
    if (!StuartProject.instance) {
      StuartProject.instance = new StuartProject();
    }
    return StuartProject.instance;
  }
}

export type StuartProjectSectionValue = string | boolean | number;

export interface StuartProjectConfig {
  project_definition: {
    [key: string]: StuartProjectSectionValue;
  };
  props: {
    [key: string]: StuartProjectSectionValue;
  };
  [key: string]: {
    [key: string]: StuartProjectSectionValue;
  };
}
