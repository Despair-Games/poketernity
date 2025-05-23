import { getPokemonNameWithAffix } from "#app/messages";
import { Stat, type BattleStat } from "#enums/stat";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a Pokemon has a specific {@linkcode Stat} stage
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param stat - The {@linkcode Stat} to check
 * @param expectedStage - The expected stage of the {@linkcode stat}
 * @returns Whether the matcher passed
 */
export function toHaveStatStageMatcher(
  this: MatcherState,
  received: unknown,
  stat: BattleStat,
  expectedStage: number,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const actualStage = received.getStatStage(stat);
  const pass = actualStage === expectedStage;

  const pkmName = getPokemonNameWithAffix(received);
  const statName = Stat[stat];

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} ${statName} stage to NOT be ${expectedStage}, but it is!`
        : `Expected ${pkmName} ${statName} stage to be ${expectedStage}, but got ${actualStage}.`,
  };
}
