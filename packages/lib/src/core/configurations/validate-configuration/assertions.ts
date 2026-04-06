import { getTypeName } from "../../../shared/get-type-name";
import { isObject } from "../../../shared/is-object";
import { isValidDate } from "../../../shared/is-valid-date";
import { isValidDateString } from "../../../shared/is-valid-date-string";
import { ConfigurationValidationError } from "./errors";

function throwTypeError(key: string, expectedType: string, propValueType: string) {
  throw new ConfigurationValidationError(
    `Unexpected type ${propValueType} for configuration property '${key}'. Expected ${expectedType}`
  );
}

/**
 * Asserts that a configuration property is not null or undefined.
 * @param key - The name of the property being validated.
 * @param propValue - The value of the property to validate.
 * @throws {Configuration} If the property value is null or undefined.
 */
export function assertNotNullProp(key: string, propValue: unknown) {
  if (propValue === null || propValue === undefined) {
    throw new ConfigurationValidationError(`Missing required configuration property '${key}'`);
  }
}

/**
 * Asserts that a property value is a string.
 * @param key - The name of the property being validated.
 * @param propValue - The value to validate.
 * @throws {Error} Throws a type error if propValue is not a string.
 */
export function assertStringProp(key: string, propValue: unknown) {
  const propValueType = typeof propValue;
  if (propValueType !== "string") throwTypeError(key, "string", propValueType);
}

/**
 * Asserts that a property value is a valid date string.
 * @param key - The name of the property being validated.
 * @param propValue - The property value to validate. Should be a date string in format "YYYY-MM-DD" or "YYYY-MM-DD HH:mm:SS".
 * @throws {TypeError} Throws a TypeError if the property value is not a valid date string.
 */
export function assertDateProp(key: string, propValue?: unknown) {
  if (typeof propValue === "string" && !isValidDateString(propValue as string))
    throwTypeError(key, "YYYY-MM-DD date or YYYY-MM-DD HH:mm:SS datetime", "string");

  if (!isValidDate(propValue as string))
    throwTypeError(key, "YYYY-MM-DD date or YYYY-MM-DD HH:mm:SS datetime", "unknown");
}

export function assertIsObjectProp(key: string, expectedType: string, propValue?: unknown) {
  if (!isObject(propValue)) throwTypeError(key, expectedType, getTypeName(propValue));
}

export function assertIsNullableObjectProp(key: string, propValue?: unknown) {
  if (propValue !== null && propValue !== undefined && !isObject(propValue))
    throwTypeError(key, "record", getTypeName(propValue));
}
