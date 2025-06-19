import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";
import { toDmgValue } from "#utils/common-utils";

/**
 * Attribute to set move damage randomly between 0.5x and 1.5x the user's level.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Psywave_(move) | Psywave}.
 */
export class RandomLevelDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override getDamage(user: Pokemon, _target: Pokemon, _move: Move): number {
    return toDmgValue(user.level * (user.randSeedIntRange(50, 150) * 0.01));
  }
}
