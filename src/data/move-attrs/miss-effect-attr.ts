import type { Pokemon } from "#app/field/pokemon";
import type { UserMoveConditionFunc, Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class MissEffectAttr extends MoveAttr {
  private missEffectFunc: UserMoveConditionFunc;

  constructor(missEffectFunc: UserMoveConditionFunc) {
    super();

    this.missEffectFunc = missEffectFunc;
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move, _args: any[]): boolean {
    this.missEffectFunc(user, move);
    return true;
  }
}
