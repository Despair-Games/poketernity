import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { FixedDamageAttr } from "#app/data/moves/move-attrs/fixed-damage-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

/**
 * Attribute to set move damage such that the target is brought down to the user's HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Endeavor_(move) | Endeavor}.
 * @extends FixedDamageAttr
 */
export class MatchHpAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    damage.value = target.hp - user.hp;

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => user.hp <= target.hp;
  }
}
