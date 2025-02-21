import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";

export class SpeciesFormChangeManualTrigger extends SpeciesFormChangeTrigger {
  override canChange(_pokemon: Pokemon): boolean {
    return true;
  }
}
