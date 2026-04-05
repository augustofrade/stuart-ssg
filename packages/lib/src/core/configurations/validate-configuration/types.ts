/**
 * Function signature for validating a configuration property.
 *
 * As it returns void, it must throw an error if validation fails
 *
 * @param key - The name of the configuration property being validated
 * @param propValue - The value of the property to validate (optional)
 * @returns void
 */
export type ConfigurationPropValidationFn = (key: string, propValue?: unknown) => void;

/**
 * Represents the validation details for a configuration property.
 * @property {unknown} value - The value of the configuration property to be validated.
 * @property {ConfigurationPropValidationFn[]} validators - An array of validation functions to be applied to the property value.
 */
export interface ConfigurationPropValidationDetails {
  value: unknown;
  validators: ConfigurationPropValidationFn[];
}

export type ConfigurationPropValidationRules<T> = {
  [key in keyof T]: ConfigurationPropValidationDetails;
};
