import type { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to modify a G-Max move's base power
 * Adds a flat +50 base power if the user is G-Max'd
 * @extends VariablePowerAttr
 */
export class GMaxPowerAttr extends VariablePowerAttr {
  /**
   * Unused, but keeping it in case we want to use it in the future
   */
  public readonly signatureSpecies: SpeciesId;

  constructor(signatureSpecies: SpeciesId) {
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
