import {
  assertNotNullProp,
  assertStringProp,
  validateConfiguration,
} from "../../configurations/validate-configuration";
import { assertObjectProp } from "../../configurations/validate-configuration/assertions";
import { UnknownThemeConfiguration } from "../theme-configuration-parser/types";

/**
 * Validates the configuration properties of a Project.
 *
 * @param configuration - The Project Configuration object to validate
 * @throws {Error} If any required property is missing, null, or of incorrect type
 *
 * @remarks
 * This function validates the following properties:
 * - `name`: Must be a non-null string
 * - `author`: Must be a non-null string
 * - `theme`: Must be a non-null string
 */
export function validateThemeConfiguration(data: UnknownThemeConfiguration) {
  validateConfiguration({
    name: {
      value: data.name,
      validators: [assertNotNullProp, assertStringProp],
    },
    version: {
      value: data.version,
      validators: [assertNotNullProp, assertStringProp],
    },
    license: {
      value: data.license,
      validators: [assertNotNullProp, assertStringProp],
    },
    author: {
      value: data.author,
      validators: [
        assertNotNullProp,
        (key: string, propValue?: unknown) => assertObjectProp(key, "ThemeAuthor", propValue),
      ],
    },
    "author.name": {
      value: data.author?.name,
      validators: [assertNotNullProp, assertStringProp],
    },
    "author.homepage": {
      value: data.author?.homepage,
      validators: [assertNotNullProp, assertStringProp],
    },
  });
}
