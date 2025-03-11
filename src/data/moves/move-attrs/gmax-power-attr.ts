import type { Species } from "#enums/species";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariablePowerAttr } from "#app/data/moves/move-attrs/variable-power-attr";

/**
 * Attribute to modify a G-Max move's base power
 * Adds a flat +50 base power if the user is G-Max'd
 * @extends VariablePowerAttr
 */
export class GMaxPowerAttr extends VariablePowerAttr {
  /**
   * Unused, but keeping it in case we want to use it in the future
   */
  public readonly signatureSpecies: Species;

  constructor(signatureSpecies: Species) {
    super();
    this.signatureSpecies = signatureSpecies;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (user.isMax()) {
      power.value += 50;
      return true;
    }
    return false;
  }
}
