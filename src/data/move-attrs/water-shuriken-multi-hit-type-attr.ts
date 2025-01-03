import { Abilities } from "#enums/abilities";
import { MultiHitType } from "#enums/multi-hit-type";
import { Species } from "#enums/species";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { ChangeMultiHitTypeAttr } from "#app/data/move-attrs/change-multi-hit-type-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Water_Shuriken_(move) Water Shuriken}'s
 * effect of always hitting 3 times when used by Battle Bond Ash Greninja.
 * @extends ChangeMultiHitTypeAttrs
 */
export class WaterShurikenMultiHitTypeAttr extends ChangeMultiHitTypeAttr {
  /** Changes the move's multi-hit type to always hit 3 times if used by Battle Bond Ash Greninja */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, hitType: NumberHolder): boolean {
    if (user.species.speciesId === Species.GRENINJA && user.hasAbility(Abilities.BATTLE_BOND) && user.formIndex === 2) {
      hitType.value = MultiHitType._3;
      return true;
    }
    return false;
  }
}
