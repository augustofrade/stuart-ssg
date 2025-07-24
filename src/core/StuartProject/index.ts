import { ResourceConfig, ResourceConfigSection } from "../../types/resource-config.type";
import BobLogger from "../BobLogger";

/**
 * Singleton class containing the active project information
 */
export default class StuartProject {
  private static readonly logger = BobLogger.Instance;
  private static instance: StuartProject;

  public initialized = false;
  public projectDirectory: string = "";
  public configs: StuartProjectConfig = {
    project_definition: {},
    props: {},
  };

  private constructor() {}

  public init(configs: StuartProjectConfig): this {
    if (this.initialized) {
      StuartProject.logger.logWarning("Stuart Project is already initialized.");
      return this;
    }
    this.configs = configs;
    this.initialized = true;
    return this;
  }

  public static get Instance() {
    if (!StuartProject.instance) {
      StuartProject.instance = new StuartProject();
    }
    return StuartProject.instance;
  }
}

export interface StuartProjectConfig extends ResourceConfig {
  project_definition: ResourceConfigSection;
  props: ResourceConfigSection;
}
