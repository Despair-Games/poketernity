import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class MatchHpAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  /** Sets damage such that the target will be brought down to the user's HP */
  override apply(user: Pokemon, target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    damage.value = target.hp - user.hp;

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => user.hp <= target.hp;
  }
}
