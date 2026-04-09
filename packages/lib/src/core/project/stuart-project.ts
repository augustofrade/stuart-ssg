import { StuartTheme } from "../theme";
import { ProjectData } from "./types";

export class StuartProject {
  private readonly categories: string[] = [];

  public constructor(
    public readonly root: string,
    public readonly data: ProjectData,
    public readonly installedThemes: StuartTheme[]
  ) {}
}
