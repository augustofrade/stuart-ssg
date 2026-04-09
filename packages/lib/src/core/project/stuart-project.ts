import { ProjectData } from "./types";

export class StuartProject {
  private readonly categories: string[] = [];
  private readonly availableThemes = [];

  public constructor(
    public readonly root: string,
    public readonly data: ProjectData
  ) {}
}
