import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { ModifiedDamageAttr } from "#app/data/move-attrs/modified-damage-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class SurviveDamageAttr extends ModifiedDamageAttr {
  /** Restricts damage to leave the target at 1 HP */
  override getModifiedDamage(_user: Pokemon, target: Pokemon, _move: Move, damage: number): number {
    return Math.min(damage, target.hp - 1);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => target.hp > 1;
  }

  override getUserBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.hp > 1 ? 0 : -20;
  }
}
