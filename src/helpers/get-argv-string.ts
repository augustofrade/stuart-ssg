export default function getArgvString(): string {
  return (
    "stuart " +
    process.argv
      .slice(2)
      .map((arg) => (arg.includes(" ") ? `"${arg}"` : arg))
      .join(" ")
  );
}
