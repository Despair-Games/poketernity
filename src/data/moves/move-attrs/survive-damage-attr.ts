import type { Pokemon } from "#field/pokemon";
import { ModifiedDamageAttr } from "#moves/modified-damage-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Attribute to restrict damage to leave the target at at least 1 HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/False_Swipe_(move) | False Swipe}.
 */
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
