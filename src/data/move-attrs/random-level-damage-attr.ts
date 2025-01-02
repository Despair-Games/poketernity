import type { Pokemon } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

/**
 * Attribute to set move damage randomly
 * between 0.5 and 1.5 * the user's level.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Psywave_(move) Psywave}.
 * @extends FixedDamageAttr
 */
export class RandomLevelDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  /** Sets damage randomly between 0.5x and 1.5x the user's level */
  override getDamage(user: Pokemon, _target: Pokemon, _move: Move): number {
    return toDmgValue(user.level * (user.randSeedIntRange(50, 150) * 0.01));
  }
}
