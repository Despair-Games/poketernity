import type { UserMoveConditionFunc } from "#app/@types/UserMoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { MoveAttr } from "#moves/move-attr";

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
