import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

/**
 * Attribute to set move damage equal to the user's HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Final_Gambit_(move) Final Gambit}.
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
