import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Water_Shuriken_(move) | Water Shuriken}'s
 * effect of setting the move's power to 20 per strike when
 * used by Battle Bond Ash Greninja.
 * @extends VariablePowerAttr
 */
export class WaterShurikenPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (
      user.species.speciesId === SpeciesId.GRENINJA
      && user.hasAbility(AbilityId.BATTLE_BOND)
      && user.formIndex === 2
    ) {
      power.value = 20;
      return true;
    }
    return false;
  }
}
