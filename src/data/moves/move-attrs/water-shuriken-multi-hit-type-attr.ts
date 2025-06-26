import { AbilityId } from "#enums/ability-id";
import { MultiHitType } from "#enums/multi-hit-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import { ChangeMultiHitTypeAttr } from "#moves/change-multi-hit-type-attr";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Water_Shuriken_(move) | Water Shuriken}'s
 * effect of always hitting 3 times when used by Battle Bond Ash Greninja.
 */
export class WaterShurikenMultiHitTypeAttr extends ChangeMultiHitTypeAttr {
  /** Changes the move's multi-hit type to always hit 3 times if used by Battle Bond Ash Greninja */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, hitType: NumberHolder): boolean {
    if (
      user.species.speciesId === SpeciesId.GRENINJA
      && user.hasAbility(AbilityId.BATTLE_BOND)
      && user.formIndex === 2
    ) {
      hitType.value = MultiHitType._3;
      return true;
    }
    return false;
  }
}
