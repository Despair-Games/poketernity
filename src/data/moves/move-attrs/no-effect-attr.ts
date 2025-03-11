import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { UserMoveConditionFunc } from "#app/@types/UserMoveConditionFunc";

/**
 * Attribute to apply an effect when a move has no effect on the target.
 * @extends MoveAttr
 * @see {@linkcode noEffectFunc}
 */
export class NoEffectAttr extends MoveAttr {
  private noEffectFunc: UserMoveConditionFunc;

  constructor(noEffectFunc: UserMoveConditionFunc) {
    super();

    this.noEffectFunc = noEffectFunc;
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    this.noEffectFunc(user, move);
    return true;
  }
}
