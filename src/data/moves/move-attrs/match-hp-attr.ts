import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-condition-func";
import type { NumberHolder } from "#utils/common-utils";

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
