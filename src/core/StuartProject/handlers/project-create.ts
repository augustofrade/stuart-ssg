import fs from "fs/promises";
import path from "path";
import StuartProject from "..";
import BobLogger from "../../BobLogger";
import { CreateStuartProjectOptions } from "../types";

export default class StuartProjectCreate {
  private static readonly logger = BobLogger.Instance;

  public static async handle(options: CreateStuartProjectOptions): Promise<StuartProject | null> {
    const { projectName, projectDirectory, theme } = options;
    console.log(projectDirectory);

    try {
      await fs.mkdir(path.join(projectDirectory, "pages"), { recursive: true });
      await fs.writeFile(
        path.join(projectDirectory, "pages", "index.md"),
        `# Home Page\n\nWelcome to ${projectName}!`,
        "utf8"
      );
    } catch (error) {
      this.logger.logError(`Failed to create project:\n${(error as Error).message}`);
      return null;
    }

    return new StuartProject(projectName, projectDirectory, theme);
  }
}
