import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeTrigger } from "#form-change-triggers/species-form-change-trigger";
import { coerceArray } from "#utils/common-utils";

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
