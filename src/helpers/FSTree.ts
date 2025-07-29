import fs from "fs/promises";
import path from "path";

export default class FSTree {
  public static async files(dirPath: string): Promise<string[]> {
    return this.listDir(dirPath, "file");
  }

  public static async directories(dirPath: string): Promise<string[]> {
    return this.listDir(dirPath, "directory");
  }

  private static async listDir(
    dirPath: string,
    expectedType: "file" | "directory"
  ): Promise<string[]> {
    const result: string[] = [];

    async function readDirectory(currentPath: string, relativePath: string = ""): Promise<void> {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativeEntryPath = relativePath ? path.join(relativePath, entry.name) : entry.name;

        if (expectedType === "directory" && entry.isDirectory()) {
          result.push(relativeEntryPath);
          await readDirectory(fullPath, relativeEntryPath);
        } else if (expectedType === "file") {
          if (entry.isDirectory()) {
            await readDirectory(fullPath, relativeEntryPath);
          } else {
            result.push(relativeEntryPath);
          }
        }
      }
    }

    await readDirectory(dirPath);
    return result;
  }
}
