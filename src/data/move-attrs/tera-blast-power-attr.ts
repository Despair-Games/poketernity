import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Increases the power of Tera Blast to 100 if the user is Terastallized into Stellar type
 * @extends VariablePowerAttr
 */
export class TeraBlastPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (user.isTerastallized() && user.getTeraType() === ElementalType.STELLAR) {
      power.value = 100;
      return true;
    }

    return false;
  }
}
