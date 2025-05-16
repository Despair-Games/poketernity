import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

export class MoveCondition {
  /** The {@linkcode MoveConditionFunc | function} to determine if the move can be used */
  public condition: MoveConditionFunc;

  constructor(condition: MoveConditionFunc) {
    this.condition = condition;
  }

  /**
   * Calculates the Condition Score (CS) granted to moves with this condition.
   *
   * By default, this grants a {@link BAD_MOVE_PENALTY | Bad Move Penalty} if
   * the condition fails during command selection. However, conditions may need
   * to override this method if they can't be resolved at that time.
   * @param user - The {@linkcode EnemyPokemon} evaluating the move
   * @param target - The {@linkcode Pokemon} against which the move is evaluated
   * @param move - The {@linkcode Move} to evaluate
   * @returns The CS for the move action. This score should be an integer.
   */
  public getConditionScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    return this.condition(user, target, move, true) ? 0 : BAD_MOVE_PENALTY;
  }
}
