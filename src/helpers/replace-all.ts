export default function replaceAll(
  originalString: string,
  keyValuePairs: Record<string, any>
): string {
  for (const [key, value] of Object.entries(keyValuePairs)) {
    const placeholder = `%${key.toUpperCase()}%`;
    originalString = originalString.replace(new RegExp(placeholder, "g"), String(value));
  }
  return originalString;
}
