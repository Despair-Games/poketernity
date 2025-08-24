import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

type MoveIncrementFunc = (pokemon: Pokemon) => boolean;

/**
 * Attribute used for moves that change priority in a turn given a condition.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Grassy_Glide_(move) | Grassy Glide}.
 */
export class IncrementMovePriorityAttr extends MoveAttr {
  /** The condition for a move's priority being incremented */
  private readonly moveIncrementFunc: MoveIncrementFunc;
  /** The amount to increment priority by, if condition passes. */
  private readonly increaseAmount: number;

  constructor(moveIncrementFunc: MoveIncrementFunc, increaseAmount = 1) {
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
  override apply(user: Pokemon, _target: Pokemon | null, _move: Move, priority: NumberHolder): boolean {
    if (!this.moveIncrementFunc(user)) {
      return false;
    }

    priority.value += this.increaseAmount;
    return true;
  }
}
