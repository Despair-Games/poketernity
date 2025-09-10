import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { UserMoveConditionFunc } from "#types/move-types";

/**
 * Attribute to add an effect that triggers when the move misses.
 * @see {@linkcode missEffectFunc}
 */
export class MissEffectAttr extends MoveAttr {
  private readonly missEffectFunc: UserMoveConditionFunc;

  constructor(missEffectFunc: UserMoveConditionFunc) {
    super();

    this.missEffectFunc = missEffectFunc;
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    this.missEffectFunc(user, move);
    return true;
  }
}
