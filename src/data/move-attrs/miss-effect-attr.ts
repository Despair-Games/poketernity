import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { UserMoveConditionFunc } from "../move-conditions";

export class MissEffectAttr extends MoveAttr {
  private missEffectFunc: UserMoveConditionFunc;

  constructor(missEffectFunc: UserMoveConditionFunc) {
    super();

    this.missEffectFunc = missEffectFunc;
  }

  /**
   * Applies this attribute's on-miss function
   * @param user the {@linkcode Pokemon} using the move
   * @param _target n/a
   * @param move the {@linkcode Move} being used
   * @returns `true`
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    this.missEffectFunc(user, move);
    return true;
  }
}
