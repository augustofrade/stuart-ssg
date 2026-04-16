import { getTypeName } from "../../shared/get-type-name";
import { InvalidQueryError } from "./errors";
import { ContentInterpolationValue } from "./types";

const validValues = ["boolean", "date", "string", "number"];

export function getContextValue(
  context: Record<string, any>,
  query: string
): ContentInterpolationValue {
  const parts = query.split(".");
  let current = context;

  const maxIterations = parts.length;

  for (let i = 0; i <= maxIterations; i++) {
    const part = parts[i];
    if (current === undefined) {
      if (i < maxIterations) {
        const currentCtxMap = parts.slice(0, i).join(".");
        throw new InvalidQueryError(part!, currentCtxMap, query);
      }
      return undefined;
    }

    const propValueType = getTypeName(current);
    if (validValues.includes(propValueType)) {
      if (i < maxIterations) {
        const currentCtxMap = parts.slice(0, i).join(".");
        throw new InvalidQueryError(part!, currentCtxMap, query, propValueType);
      }
      // requires type casting because typescript will think it is still Record<string, any>
      // although it's actually a valid context property type
      return current as ContentInterpolationValue;
    }

    current = current[part!];
  }
}
