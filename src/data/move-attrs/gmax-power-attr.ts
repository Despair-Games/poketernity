import type { Species } from "#enums/species";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute to modify a G-Max move's base power
 * ```
 * |                 | default bp | max bp | max and signature |
 * |-----------------|------------|--------|-------------------|
 * | Poison/Fighting | 60         | 90     | 100               |
 * | All other types | 80         | 120    | 130               |
 * ```
 * @extends VariablePowerAttr
 */
export class GMaxPowerAttr extends VariablePowerAttr {
  signatureSpecies: Species;

  constructor(signatureSpecies: Species) {
    super();
    this.signatureSpecies = signatureSpecies;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    if (user.isMax()) {
      power.value *= 1.5;
      if (user.species.speciesId === this.signatureSpecies) {
        power.value += 10;
      }
      return true;
    }
    return false;
  }
}
