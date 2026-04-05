import {
  assertNotNullProp,
  assertStringProp,
  validateConfiguration,
} from "../../configurations/validate-configuration";
import { ProjectConfiguration } from "../types";

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
export function validateProjectConfiguration(configuration: ProjectConfiguration) {
  validateConfiguration({
    name: {
      value: configuration.project.name,
      validators: [assertNotNullProp, assertStringProp],
    },
    author: {
      value: configuration.project.author,
      validators: [assertNotNullProp, assertStringProp],
    },
    theme: {
      value: configuration.project.theme,
      validators: [assertNotNullProp, assertStringProp],
    },
  });
}
