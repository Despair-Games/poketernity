import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Increases the power of Tera Blast to 100 if the user is Terastallized into Stellar type
 */
export class TeraBlastPowerAttr extends VariablePowerAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (user.isTerastallized && user.teraType === ElementalType.STELLAR) {
      power.value = 100;
      return true;
    }

    return false;
  }
}
