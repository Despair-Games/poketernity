import { getPokemonNameWithAffix } from "#app/messages";
import type { BattleStat } from "#enums/stat";
import { getStatName } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher that checks if a Pokemon has a specific stat stage.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param stat - The {@linkcode BattleStat | Stat} to check
 * @param expected - The expected value of the {@linkcode StatStage | stat stage}. Must be within the range `[-6, 6]`
 * @returns Whether the matcher passed
 */
export function toHaveStatStage(
  this: Readonly<MatcherState>,
  received: unknown,
  stat: BattleStat,
  expected: number,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  if (expected < -6 || expected > 6) {
    return {
      pass: this.isNot,
      message: () => `Expected "${expected}" to be within the range [-6, 6]!`,
    };
  }

  const actual = received.getStatStage(stat);
  const pass = actual === expected;

  const pkmName = getPokemonNameWithAffix(received);
  const statName = getStatName(stat);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName}'s ${statName} stat stage to NOT be ${expected}, but it was!`
        : `Expected ${pkmName}'s ${statName} stat stage to be ${expected}, but got ${actual} instead!`,
    expected,
    actual,
  };
}
