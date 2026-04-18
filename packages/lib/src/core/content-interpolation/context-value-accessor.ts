import { getTypeName } from "../../shared/get-type-name";
import { InvalidQueryError } from "./errors";
import { ContentInterpolationValue } from "./types";

export class ContextValueAccessor {
  public constructor(private readonly context: Record<string, any>) {}

  private static validValues = ["boolean", "date", "string", "number"];

  public get(query: string): ContentInterpolationValue {
    const parts = query.split(".");
    let current = this.context;

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

      if (ContextValueAccessor.validValues.includes(propValueType)) {
        if (i < maxIterations) {
          const currentCtxMap = parts.slice(0, i).join(".");
          throw new InvalidQueryError(part!, currentCtxMap, query, propValueType);
        }
        // requires type casting because typescript will think it is still Record<string, any>
        // although it's actually a valid context property type
        return current as ContentInterpolationValue;
      } else if (i === maxIterations) {
        return JSON.stringify(current);
      }

      current = current[part!];
    }

    return JSON.stringify(current);
  }
}
