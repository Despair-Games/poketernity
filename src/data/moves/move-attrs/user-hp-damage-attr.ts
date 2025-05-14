import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to set move damage equal to the user's HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Final_Gambit_(move) | Final Gambit}.
 * @extends FixedDamageAttr
 */
export class UserHpDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    damage.value = user.hp;

    return true;
  }
}
