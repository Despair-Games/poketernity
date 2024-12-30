import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class ModifiedDamageAttr extends MoveAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, damage: NumberHolder): boolean {
    damage.value = this.getModifiedDamage(user, target, move, damage.value);

    return true;
  }

  getModifiedDamage(_user: Pokemon, _target: Pokemon, _move: Move, damage: number): number {
    return damage;
  }
}
