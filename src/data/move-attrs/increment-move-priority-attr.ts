import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute used for moves that change priority in a turn given a condition.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Grassy_Glide_(move) Grassy Glide}.
 * @extends MoveAttr
 */

export class IncrementMovePriorityAttr extends MoveAttr {
  /** The condition for a move's priority being incremented */
  private moveIncrementFunc: (pokemon: Pokemon, target: Pokemon, move: Move) => boolean;
  /** The amount to increment priority by, if condition passes. */
  private increaseAmount: number;

  constructor(moveIncrementFunc: (pokemon: Pokemon, target: Pokemon, move: Move) => boolean, increaseAmount = 1) {
    super();

    this.moveIncrementFunc = moveIncrementFunc;
    this.increaseAmount = increaseAmount;
  }

  /**
   * Increments move priority by set amount if condition passes
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param priority {@linkcode NumberHolder} containing the move's priority for this turn.
   * @returns true if function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, priority: NumberHolder): boolean {
    if (!this.moveIncrementFunc(user, target, move)) {
      return false;
    }

    priority.value += this.increaseAmount;
    return true;
  }
}
