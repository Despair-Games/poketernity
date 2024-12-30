import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class FixedDamageAttr extends MoveAttr {
  private damage: number;

  constructor(damage: number) {
    super();

    this.damage = damage;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, damage: NumberHolder): boolean {
    damage.value = this.getDamage(user, target, move);

    return true;
  }

  getDamage(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return this.damage;
  }
}
