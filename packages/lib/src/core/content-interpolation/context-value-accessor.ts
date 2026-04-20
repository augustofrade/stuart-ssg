import { getTypeName } from "../../shared/get-type-name";
import { BuildContext } from "../build-context";
import { InvalidQueryError } from "./errors";
import { ContentInterpolationValue } from "./types";

/**
 * Provides an interface for accessing Build Context values through property string queries.
 *
 * @notes
 * - Does not format Date objects into strings.
 * - Transforms queried objects into JSON.
 */
export class ContextValueAccessor {
  public constructor(private readonly context: BuildContext) {}

  private static validValues = ["boolean", "date", "string", "number"];

  /**
   * Gets the value of the passed object query.
   *
   * @example
   * ```typescript
   * // Considering a BuildContext like this:
   * const context = {
   *   project: {
   *      name: "stuart",
   *      props: {
   *        github_url: "https://github.com/augustofrade/stuart-ssg",
   *        birthday: new Date("2026-04-24"),
   *      },
   *   },
   * };
   *
   * // The property "birthday" can be fetched with:
   * contextAccessor.get("project.props.birthday");
   * ```
   *
   * @param query Object query for the target value.
   * @returns
   * - The value found if the query is valid;
   * - _undefined_ if the query is invalid;
   * - A JSON string if the object key is an object.
   */
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

      if (this.isValidPropertyType(propValueType)) {
        if (i < maxIterations) {
          const currentCtxMap = parts.slice(0, i).join(".");
          throw new InvalidQueryError(part!, currentCtxMap, query, propValueType);
        }
        // requires type casting because typescript will think it still is BuildContext / Record<string, any>
        // although it's actually a valid context property type.
        return current as unknown as ContentInterpolationValue;
      } else if (i === maxIterations) {
        return JSON.stringify(current);
      }

      current = (current as any)[part!];
    }

    // the resulting property value will always be one that isn't in validValues,
    // like an object (Record) or array
    return JSON.stringify(current);
  }

  private isValidPropertyType(propValueType: string) {
    return ContextValueAccessor.validValues.includes(propValueType);
  }
}
