import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { coerceArray } from "#app/utils/common-utils";
import type { StatusEffect } from "#enums/status-effect";

export class SpeciesFormChangeStatusEffectTrigger extends SpeciesFormChangeTrigger {
  public statusEffects: StatusEffect[];
  public invert: boolean;

  constructor(statusEffects: StatusEffect | StatusEffect[], invert: boolean = false) {
    super();
    statusEffects = coerceArray(statusEffects);
    this.statusEffects = statusEffects;
    this.invert = invert;
  }

  override canChange(pokemon: Pokemon): boolean {
    const hasStatus = pokemon.hasStatusEffect(this.statusEffects, false, true);
    return this.invert ? hasStatus : !hasStatus;
  }
}
