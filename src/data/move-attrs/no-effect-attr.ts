import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { UserMoveConditionFunc } from "../move-conditions";

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
