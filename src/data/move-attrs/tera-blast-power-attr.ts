import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Increases the power of Tera Blast if the user is Terastallized into Stellar type
 * @extends VariablePowerAttr
 */
export class TeraBlastPowerAttr extends VariablePowerAttr {
  /**
   * Sets Tera Blast's power to 100 if the user is terastallized with
   * the Stellar tera type.
   * @param user {@linkcode Pokemon} the Pokemon using this move
   * @param _target n/a
   * @param _move {@linkcode Move} the Move with this attribute (i.e. Tera Blast)
   * @param power {@linkcode NumberHolder} containing the move's power for the turn
   * @returns
   */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (user.isTerastallized() && user.getTeraType() === Type.STELLAR) {
      power.value = 100;
      return true;
    }

    return false;
  }
}
