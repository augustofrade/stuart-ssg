import { ResourceConfig, ResourceConfigSection } from "../../types/resource-config.type";
import BobLogger from "../BobLogger";
import StuartProjectPaths from "./StuartProjectPaths";

/**
 * Singleton class containing the active project information
 */
export default class StuartProject {
  private static readonly logger = BobLogger.Instance;
  private _paths: StuartProjectPaths = new StuartProjectPaths("");
  private static instance: StuartProject;

  public initialized = false;
  public configs: StuartProjectConfig = {
    project_definition: {},
    props: {},
  };

  private constructor() {}

  public init(projectDirectory: string, configs: StuartProjectConfig): this {
    if (this.initialized) {
      StuartProject.logger.logWarning("Stuart Project is already initialized.");
      return this;
    }
    this._paths = new StuartProjectPaths(projectDirectory);
    this.configs = configs;
    this.initialized = true;
    return this;
  }

  public get paths(): StuartProjectPaths {
    if (!this.initialized) {
      throw new Error("Stuart Project is not initialized.");
    }
    return this._paths;
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
