import type { Pokemon } from "#app/field/pokemon";
import type { Move, MoveConditionFunc } from "#app/data/move";
import { ModifiedDamageAttr } from "#app/data/move-attrs/modified-damage-attr";

export class SurviveDamageAttr extends ModifiedDamageAttr {
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
