/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { EnemyPokemon } from "#field/enemy-pokemon";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { BattleCommand } from "#enums/battle-command";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if an {@linkcode EnemyPokemon} prefers switching to another
 * Pokemon in the current game state.
 * @param received - The object to check. Should be an {@linkcode EnemyPokemon}
 * @param switchInIndex - (Optional) The current party slot of the {@linkcode EnemyPokemon}
 * expected to take the received enemy's place on the field
 * @returns Whether the matcher passed, and the message to display in case of failure
 */
export function toPreferSwitchingMatcher(
  this: MatcherState,
  received: unknown,
  switchInIndex?: number,
): SyncExpectationResult {
  if (!isPokemonInstance(received) || !received.isEnemy()) {
    return {
      pass: this.isNot,
      message: () => `Expected EnemyPokemon, but got ${receivedStr(received)}!`,
    };
  }

  if (activeOverrides.ENEMY_DISABLE_SWITCHING_OVERRIDE) {
    return {
      pass: this.isNot,
      message: () => "Overrides are preventing the enemy from switching!",
    };
  }

  const enemyCommand = received.getNextCommand();
  const pkmName = getPokemonNameWithAffix(received);
  const isSwitchCommand = enemyCommand?.command === BattleCommand.POKEMON;
  const pass = isSwitchCommand && (switchInIndex == null || switchInIndex === enemyCommand.cursor);

  return {
    pass,
    message: () => {
      if (pass) {
        return switchInIndex == null
          ? `Expected ${pkmName} to NOT prefer switching, but it does!`
          : `Expected ${pkmName} to NOT prefer switching with index ${switchInIndex}, but it does!`;
      }

      return isSwitchCommand
        ? `Expected ${pkmName}'s preferred switch-in to be index ${switchInIndex}, but got index ${enemyCommand.cursor}!`
        : `Expected ${pkmName} to prefer switching, but it doesn't!`;
    },
  };
}
