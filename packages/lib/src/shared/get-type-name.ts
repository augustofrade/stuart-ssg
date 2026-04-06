export function getTypeName(value: any): string {
  return (
    Object.prototype.toString.call(value).split(" ")[1]?.slice(0, -1).toLowerCase() ?? "undefined"
  );
}
