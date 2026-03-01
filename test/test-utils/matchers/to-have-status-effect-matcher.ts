import { getPokemonNameWithAffix } from "#app/messages";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { getEnumStr, getOnelineDiffStr } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { Status } from "#types/pokemon-types";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

//#region Types

/**
 * Parameter type for {@linkcode toHaveStatusEffect}, accepting a partially filled {@linkcode Status} object.
 * @sealed
 */
export type PartiallyFilledStatus =
  | { effect: typeof StatusEffect.TOXIC; toxicTurnCount: number }
  | { effect: typeof StatusEffect.SLEEP; sleepTurnsRemaining: number };

//#endregion
//#region Exports

/**
 * Check whether a Pokemon has a specific non-volatile status effect.
 * @param received - The actual value received. Should be a {@linkcode Pokemon}
 * @param expected - The {@linkcode StatusEffect} the Pokemon is expected to have,
 *   or a {@linkcode PartiallyFilledStatus} object containing the desired properties.
 * @param ignoreMockAbility - (Default `false`) Whether to ignore the effects of abilities that mock status effects (i.e. Comatose). \
 *   **Note:** This param is is forced to be `true` if checking against a {@linkcode Status} object instead of a `StatusEffect`.
 * @returns Whether the matcher passed
 */
export function toHaveStatusEffect(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: StatusEffect | PartiallyFilledStatus,
  ignoreMockAbility: boolean = false,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  if (typeof expected === "object") {
    ignoreMockAbility = true;
  }

  const pkmName = getPokemonNameWithAffix(received);
  const actualEffect = received.getStatusEffect(ignoreMockAbility);

  // Check exclusively effect equality first, coercing non-matching status effects to numbers.
  if (typeof expected === "object" && actualEffect !== expected.effect) {
    expected = expected.effect;
  }

  if (typeof expected === "number") {
    const pass = actualEffect === expected;

    const actualStr = getEnumStr(StatusEffect, actualEffect, { prefix: "StatusEffect." });
    const expectedStr = getEnumStr(StatusEffect, expected, { prefix: "StatusEffect." });

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${pkmName} to NOT have ${expectedStr}, but it did!`
          : `Expected ${pkmName} to have status effect ${expectedStr}, but got ${actualStr} instead!`,
      expected,
      actual: actualEffect,
    };
  }

  // Check for equality of all fields (for toxic turn count/etc)
  const actualStatus = received["status"];
  const pass = this.equals(actualStatus, expected, [
    ...this.customTesters,
    this.utils.subsetEquality,
    this.utils.iterableEquality,
  ]);

  const expectedStr = getOnelineDiffStr.call(this, expected);
  const actualStr = getOnelineDiffStr.call(this, actualStatus);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName}'s status to NOT match ${expectedStr}, but it did!`
        : `Expected ${pkmName}'s status to match ${expectedStr}, but got ${actualStr} instead!`,
    expected,
    actual: actualStatus,
  };
}

//#endregion
