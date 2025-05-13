import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to set move damage equal to the user's level.
 * @extends FixedDamageAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Seismic_Toss | Variations of Seismic Toss}
 */
export class LevelDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override getDamage(user: Pokemon, _target: Pokemon, _move: Move): number {
    return user.level;
  }
}
