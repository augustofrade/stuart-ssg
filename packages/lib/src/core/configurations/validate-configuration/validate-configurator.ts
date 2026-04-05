import { ConfigurationPropValidationDetails, ConfigurationPropValidationRules } from "./types";

/**
 * Validates a configuration object against a set of validation rules.
 *
 * @template T - The type of the configuration object being validated.
 * @param rules - An object mapping configuration property names to their validation details,
 *                including the property value and associated validators.
 *
 * @throws Will throw an error if any validator fails (throws) during validation.
 *
 * @example
 * ```typescript
 * const rules: ConfigurationPropValidationRules<MyConfig> = {
 *   apiUrl: {
 *     value: 'https://api.example.com',
 *     validators: [isString, isValidUrl]
 *   }
 * };
 * validateConfiguration(rules);
 * ```
 */
export function validateConfiguration<T>(rules: ConfigurationPropValidationRules<T>) {
  for (const [key, details] of Object.entries(rules)) {
    const d = details as ConfigurationPropValidationDetails;
    for (const validator of d.validators) {
      validator(key, d.value);
    }
  }
}
