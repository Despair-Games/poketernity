import type { UserMoveConditionFunc } from "#app/@types/UserMoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { MoveAttr } from "#moves/move-attr";

/**
 * Attribute to add an effect that triggers when the move misses.
 * @extends MoveAttr
 * @see {@linkcode missEffectFunc}
 */
export class MissEffectAttr extends MoveAttr {
  private missEffectFunc: UserMoveConditionFunc;

  constructor(missEffectFunc: UserMoveConditionFunc) {
    super();

    this.missEffectFunc = missEffectFunc;
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    this.missEffectFunc(user, move);
    return true;
  }
}
