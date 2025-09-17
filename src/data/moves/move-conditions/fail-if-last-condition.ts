import { globalScene } from "#app/global-scene";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Condition for moves that fail if used last in turn order,
 * e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Protect_(move) | Protect}.
 * @extends MoveCondition
 */
export class FailIfLastCondition extends MoveCondition {
  constructor() {
    super(failIfLastCondition);
  }

  /**
   * This condition doesn't contribute to score because the AI
   * - can't resolve the condition during command selection, and
   * - can't reasonably expect the condition to fail when the move is used.
   */
  public override getConditionScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}

const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  !globalScene.currentBattle.turnManager.isEmpty();
