import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move, MoveConditionFunc } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

export class MatchHpAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    (args[0] as NumberHolder).value = target.hp - user.hp;

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => user.hp <= target.hp;
  }
}
