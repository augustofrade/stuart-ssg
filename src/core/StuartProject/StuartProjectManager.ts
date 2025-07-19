import StuartProjectCreate from "./handlers/project-create";
import { CreateStuartProjectOptions } from "./types";

export default class StuartProjectManager {
  public static async create(options: CreateStuartProjectOptions): Promise<boolean> {
    return new StuartProjectCreate(options).handle();
  }
}
