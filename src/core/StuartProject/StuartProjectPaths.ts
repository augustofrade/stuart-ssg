import { join } from "path";

export default class StuartProjectPaths {
  public readonly root = this.projectPath;
  public readonly pages = join(this.projectPath, "pages");
  public readonly themes = join(this.projectPath, "themes");
  public readonly static = join(this.projectPath, "static");
  public readonly configFile = join(this.projectPath, "stuart.conf");

  public constructor(public readonly projectPath: string) {}
}
