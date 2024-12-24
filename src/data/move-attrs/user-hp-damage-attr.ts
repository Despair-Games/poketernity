import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

export class UserHpDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    (args[0] as NumberHolder).value = user.hp;

    return true;
  }
}
