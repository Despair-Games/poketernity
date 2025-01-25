import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Heals the target only if it is the ally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pollen_Puff_(move) | Pollen Puff}.
 * @extends HealAttr
 */
export class ConditionalHealAttr extends HealAttr {
  private healCondition: MoveConditionFunc;

  constructor(healRatio: number, selfTarget: boolean, healCondition: MoveConditionFunc) {
    super(healRatio, true, selfTarget);
    this.healCondition = healCondition;
  }
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (this.healCondition(user, target, move)) {
      super.apply(user, target, move);
      return true;
    }

    return false;
  }
}
