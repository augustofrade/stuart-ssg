import path from "path";
import { Directories } from "../directories";
import { StuartTheme } from "../theme";
import { ProjectContentTree } from "./project-content-mapper";
import { ProjectData, ProjectPaths } from "./types";

export class StuartProject {
  public readonly paths: ProjectPaths;

  public constructor(
    public readonly root: string,
    public readonly data: ProjectData,
    public readonly content: ProjectContentTree,
    public readonly installedThemes: StuartTheme[]
  ) {
    this.paths = {
      publish: path.join(this.root, Directories.PUBLISH),
      publishedAssets: path.join(this.root, Directories.PUBLISH, Directories.PUBLISH_ASSETS),
      content: path.join(this.root, Directories.CONTENT),
      themes: path.join(this.root, Directories.THEMES),
    };
  }

  public getPublishPathForContent(resource: string) {
    resource = path.relative(this.paths.content, resource);
    return path.join(this.paths.publish, resource);
  }
}
