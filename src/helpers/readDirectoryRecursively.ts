import fs from "fs/promises";
import path from "path";

export default async function readDirectoryRecursively(dirPath: string): Promise<string[]> {
  const result: string[] = [];

  async function readDirectory(currentPath: string, relativePath: string = ""): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativeEntryPath = relativePath ? path.join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        await readDirectory(fullPath, relativeEntryPath);
      } else {
        result.push(relativeEntryPath);
      }
    }
  }

  await readDirectory(dirPath);
  return result;
}
