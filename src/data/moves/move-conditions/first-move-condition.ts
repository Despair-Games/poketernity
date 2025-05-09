import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { MoveCondition } from "#moves/move-condition";

export class FirstMoveCondition extends MoveCondition {
  constructor() {
    super((user, _target, _move) => user.summonData?.waveTurnCount === 1);
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return this.apply(user, target, move) ? 10 : -20;
  }
}
