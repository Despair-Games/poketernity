import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

export class LevelDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override getDamage(user: Pokemon, _target: Pokemon, _move: Move): number {
    return user.level;
  }
}
