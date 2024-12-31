import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

export class WaterShurikenPowerAttr extends VariablePowerAttr {
  /** Sets the move's power to 20 per strike if used by Battle Bond Ash Greninja */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (user.species.speciesId === Species.GRENINJA && user.hasAbility(Abilities.BATTLE_BOND) && user.formIndex === 2) {
      power.value = 20;
      return true;
    }
    return false;
  }
}
