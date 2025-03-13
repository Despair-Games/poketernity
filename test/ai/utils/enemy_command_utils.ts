import type BattleScene from "#app/battle-scene";
import { allMoves } from "#app/data/data-lists";
import type { EnemyPokemon } from "#app/field/pokemon";
import { randSeedInt } from "#app/utils";
import type { MoveId } from "#enums/move-id";
import { vi } from "vitest";

const NUM_TRIALS = 300;

export type MoveChoiceSet = { [key: number]: number };

export function getEnemyMoveChoices(scene: BattleScene, pokemon: EnemyPokemon, moveChoices: MoveChoiceSet): void {
  // Use an unseeded random number generator in place of the mocked-out randBattleSeedInt
  vi.spyOn(scene, "randBattleSeedInt").mockImplementation((range, min?) => {
    return randSeedInt(range, min);
  });
  for (let i = 0; i < NUM_TRIALS; i++) {
    const queuedMove = pokemon.getNextMove();
    moveChoices[queuedMove.move.id]++;
  }

  for (const [key, count] of Object.entries(moveChoices)) {
    const moveId = parseInt(key) as MoveId;
    console.log(`Move: ${allMoves.get(moveId).name}   Count: ${count} (${Math.round((count / NUM_TRIALS) * 100)}%)`);
  }
}
