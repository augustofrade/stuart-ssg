export default function sanitizeDirName(dirName: string): string {
  return dirName
    .trim()
    .replace(/[^a-z0-9.]/gi, "-")
    .toLowerCase();
}
