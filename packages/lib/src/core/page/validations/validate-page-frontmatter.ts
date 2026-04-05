import { PageFrontmatter } from "..";
import {
  assertDateProp,
  assertNotNullProp,
  assertStringProp,
  validateConfiguration,
} from "../../configurations/validate-configuration";

/**
 * Validates the frontmatter properties of a page.
 *
 * @param frontmatter - The page frontmatter object to validate
 * @throws {Error} If any required property is missing, null, or of incorrect type
 *
 * @remarks
 * This function validates the following properties:
 * - `title`: Must be a non-null string
 * - `author`: Must be a non-null string
 * - `date`: Must be a non-null date value
 * - `description`: Must be a non-null string
 */
export function validatePageFrontmatter(frontmatter: PageFrontmatter) {
  validateConfiguration({
    title: {
      value: frontmatter.title,
      validators: [assertNotNullProp, assertStringProp],
    },
    author: {
      value: frontmatter.author,
      validators: [assertNotNullProp, assertStringProp],
    },
    date: {
      value: frontmatter.date,
      validators: [assertNotNullProp, assertDateProp],
    },
    description: {
      value: frontmatter.description,
      validators: [assertNotNullProp, assertStringProp],
    },
  });
}
