import { StuartTheme } from "../theme";
import { ProjectContentTree } from "./project-content-mapper";
import { ProjectData } from "./types";

export class StuartProject {
  public constructor(
    public readonly root: string,
    public readonly data: ProjectData,
    public readonly content: ProjectContentTree,
    public readonly installedThemes: StuartTheme[]
  ) {}
}
