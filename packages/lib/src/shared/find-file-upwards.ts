import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";

interface TargetOptions {
  name: string;
  type: "dir" | "file";
}

/**
 * Recursively searches for a file or directory by traversing upwards through parent directories.
 *
 * @param startDir - The starting directory path to begin the search from
 * @param target - Configuration object specifying the target name and type to search for
 * @param target.name - The name of the file or directory to find
 * @param target.type - The type of target: "file" or "dir"
 * @returns A promise that resolves to the full path of the found file or directory
 *
 * @throws {Error} If the startDir does not exist
 * @throws {Error} If startDir points to a file instead of a directory
 * @throws {Error} If the system root is reached without finding the target
 *
 * @example
 * ```typescript
 * const result = await findUpwardsInDirectory('./src', { name: 'package.json', type: 'file' });
 * // Returns: '/home/<user>/Documents/lib/package.json'
 * ```
 */
export async function findUpwardsInDirectory(startDir: string, target: TargetOptions) {
  if (!existsSync(startDir)) throw new Error(`No such directory '${startDir}'`);

  const pathStats = await fs.stat(startDir);
  if (!pathStats.isDirectory())
    throw new Error(`Expected directory at path '${startDir}'. Found file`);

  const dirents = await fs.readdir(startDir, { withFileTypes: true });

  for (let i = 0; i < dirents.length; i++) {
    const dirent = dirents[i];
    const direntType = dirent?.isDirectory() ? "dir" : dirent?.isFile() ? "file" : null;

    if (dirent?.name === target.name && direntType === target.type) {
      return path.join(startDir, target.name);
    }
  }

  startDir = path.normalize(startDir + "/..");
  if (startDir === path.parse(startDir).root)
    throw new Error(`System root reached. '${target.name}' not found`);

  return await findUpwardsInDirectory(startDir, target);
}
