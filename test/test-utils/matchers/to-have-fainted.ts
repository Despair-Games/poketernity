import { getPokemonNameWithAffix } from "#app/messages";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher that checks if a Pokemon has fainted.
 * @param received - The object to check. Should be a {@linkcode Pokemon}
 * @returns Whether the matcher passed
 */
export function toHaveFainted(this: Readonly<MatcherState>, received: unknown): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const { hp } = received;
  const maxHp = received.getMaxHp();
  const pkmName = getPokemonNameWithAffix(received);

  const pass = received.isFainted();

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT have fainted, but it did!`
        : `Expected ${pkmName} to have fainted, but it didn't! (${hp}/${maxHp} HP)`,
    expected: 0,
    actual: hp,
  };
}
