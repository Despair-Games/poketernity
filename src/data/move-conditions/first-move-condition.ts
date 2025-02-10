import type { Move } from "#app/data/move";
import { MoveCondition } from "#app/data/move-conditions/move-condition";
import type { Pokemon } from "#app/field/pokemon";

export class FirstMoveCondition extends MoveCondition {
  constructor() {
    super((user, _target, _move) => user.battleSummonData?.waveTurnCount === 1);
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return this.apply(user, target, move) ? 10 : -20;
  }
}
