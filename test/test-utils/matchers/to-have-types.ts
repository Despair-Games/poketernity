import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import { stringifyEnumArray } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { NonEmptyArray } from "#types/utility-types";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

export interface ToHaveTypesOptions {
  /**
   * Value dictating the strength of the enforced typing match.
   *
   * Possible values (in descending order of strength) are:
   * - `"ordered"`: Enforce that the {@linkcode Pokemon}'s types are identical **and in the same order**
   * - `"unordered"`: Enforce that the {@linkcode Pokemon}'s types are identical **without checking order**
   * - `"superset"`: Enforce that the {@linkcode Pokemon}'s types are **a superset of** the expected types
   *   (all must be present, but extras can be there)
   * @defaultValue `"unordered"`
   */
  mode?: "ordered" | "unordered" | "superset";
  /**
   * Optional arguments to pass to {@linkcode Pokemon.getTypes}.
   */
  args?: Parameters<(typeof Pokemon.prototype)["getTypes"]>;
}

/**
 * Check whether a Pokemon's current typing includes the given types.
 * @param received - The object to check. Should be a {@linkcode Pokemon}
 * @param expectedTypes - An array of one or more {@linkcode ElementalType}s to compare against.
 * @param __namedParameters - (Optional) See {@linkcode ToHaveTypesOptions}
 * @returns The result of the matching
 */
export function toHaveTypes(
  this: Readonly<MatcherState>,
  received: unknown,
  expectedTypes: Readonly<NonEmptyArray<ElementalType>>,
  { mode = "unordered", args = [] }: ToHaveTypesOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  // Return early if no types were passed in
  if (expectedTypes.length === 0) {
    return {
      pass: this.isNot,
      message: () => "Expected to receive a non-empty array of ElementalTypes!",
    };
  }

  // Avoid sorting the types if strict ordering is desired
  const actual = mode === "ordered" ? received.getTypes(...args) : received.getTypes(...args).toSorted();
  const expected = mode === "ordered" ? expectedTypes : expectedTypes.toSorted();

  // Exact matches do not care about subset equality
  const matchers =
    mode === "superset"
      ? [...this.customTesters, this.utils.iterableEquality]
      : [...this.customTesters, this.utils.subsetEquality, this.utils.iterableEquality];
  const pass = this.equals(actual, expected, matchers);

  const actualStr = stringifyEnumArray(ElementalType, actual);
  const expectedStr = stringifyEnumArray(ElementalType, expected);
  const pkmName = getPokemonNameWithAffix(received);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have types ${expectedStr}, but it did!`
        : `Expected ${pkmName} to have types ${expectedStr}, but got ${actualStr} instead!`,
    expected,
    actual,
  };
}
