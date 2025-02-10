import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { type Move } from "#app/data/move";
import { type Pokemon } from "#app/field/pokemon";

export class MoveCondition {
  protected func: MoveConditionFunc;

  constructor(func: MoveConditionFunc) {
    this.func = func;
  }

  apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    return this.func(user, target, move);
  }

  getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}
