import type BattleScene from "#app/battle-scene";
import { allMoves } from "#data/data-lists";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { randSeedInt } from "#utils/random-utils";
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
 * @param pokemon - The {@linkcode EnemyPokemon} whose move selection is evaluated
 * @returns A {@linkcode MoveChoiceSet} with the total number of times each of the Pokemon's
 * moves are selected across all trials
 */
export function getEnemyMoveChoices(pokemon: EnemyPokemon): MoveChoiceSet {
  // Use an unseeded random number generator in place of the mocked-out randBattleSeedInt
  vi.spyOn(pokemon.scene as BattleScene, "randBattleSeedInt").mockImplementation((range, min?) => {
    return randSeedInt(range, min);
  });

  const moveChoices = initMoveChoiceSet(pokemon);
  for (let i = 0; i < NUM_TRIALS; i++) {
    const queuedMove = pokemon.getNextMove();
    const prev = moveChoices[queuedMove.move.id] ?? 0;
    moveChoices[queuedMove.move.id] = prev + 1;
  }

  for (const [key, count] of Object.entries(moveChoices)) {
    const moveId = Number.parseInt(key) as MoveId;
    console.log(`Move: ${allMoves.get(moveId).name}   Count: ${count} (${Math.round((count / NUM_TRIALS) * 100)}%)`);
  }

  return moveChoices;
}

/** Reveals the abilities of all Pokemon on the field */
export function revealAllAbilities(scene: BattleScene): void {
  scene.getField(true).forEach((p) => {
    const abilityIds = p.getAbilities().map((ab) => ab.ability.id);
    p.waveData.abilitiesRevealed.push(...abilityIds);
  });
}

/** Reveals the moves of all Pokemon on the field */
export function revealAllMoves(scene: BattleScene): void {
  scene.getField(true).forEach((p) => p.getMoveset().forEach((mv) => p.waveData.revealedMoves.add(mv.moveId)));
}
