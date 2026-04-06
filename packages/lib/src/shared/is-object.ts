import { getTypeName } from "./get-type-name";

export function isObject(value: any) {
  return getTypeName(value) === "object";
}
