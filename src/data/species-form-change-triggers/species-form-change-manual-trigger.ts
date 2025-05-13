import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeTrigger } from "#form-change-triggers/species-form-change-trigger";

export class SpeciesFormChangeManualTrigger extends SpeciesFormChangeTrigger {
  override canChange(_pokemon: Pokemon): boolean {
    return true;
  }
}
