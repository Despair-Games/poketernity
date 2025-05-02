import type BattleScene from "#app/battle-scene";
import { allMoves } from "#app/data/data-lists";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import { randSeedInt } from "#app/utils/random-utils";
import type { MoveId } from "#enums/move-id";
import { vi } from "vitest";

/** The number of move selections calculated by {@linkcode getEnemyMoveChoices} */
const NUM_TRIALS = 300;

/**
 * A record for the number of times each move in a Pokemon's moveset
 * is selected across all trials of {@link getEnemyMoveChoices | move choice evaluation}
 */
type MoveChoiceSet = Partial<Record<MoveId, number>>;

/**
 * Creates a {@linkcode MoveChoiceSet} with entries for each of the given
 * {@linkcode EnemyPokemon}'s moves set to `0`.
 */
export function initMoveChoiceSet(pokemon: EnemyPokemon): MoveChoiceSet {
  const movesetIds = pokemon.getMoveset().map((mv) => mv.moveId);
  return movesetIds.reduce<MoveChoiceSet>((choiceSet, moveId) => {
    choiceSet[moveId] = 0;
    return choiceSet;
  }, {});
}

/**
 * Evaluates and reports an enemy Pokemon's move choice in the current battle state
 * over {@linkcode NUM_TRIALS} trials.
 * @param scene - The {@linkcode BattleScene | Scene} where the battle is taking place
 * @param pokemon - The {@linkcode EnemyPokemon} whose move selection is evaluated
 * @returns A {@linkcode MoveChoiceSet} with the total number of times each of the Pokemon's
 * moves are selected across all trials
 */
export function getEnemyMoveChoices(scene: BattleScene, pokemon: EnemyPokemon): MoveChoiceSet {
  // Use an unseeded random number generator in place of the mocked-out randBattleSeedInt
  vi.spyOn(scene, "randBattleSeedInt").mockImplementation((range, min?) => {
    return randSeedInt(range, min);
  });

  const moveChoices = initMoveChoiceSet(pokemon);
  for (let i = 0; i < NUM_TRIALS; i++) {
    const queuedMove = pokemon.getNextMove();
    /** @todo Is there a way to show this is defined after {@linkcode initMoveChoiceSet} without the bang? */
    moveChoices[queuedMove.move.id]!++;
  }

  for (const [key, count] of Object.entries(moveChoices)) {
    const moveId = parseInt(key) as MoveId;
    console.log(`Move: ${allMoves.get(moveId).name}   Count: ${count} (${Math.round((count / NUM_TRIALS) * 100)}%)`);
  }

  return moveChoices;
}
