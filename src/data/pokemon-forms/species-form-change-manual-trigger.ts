import type Pokemon from "#app/field/pokemon";
import { SpeciesFormChangeTrigger } from "./species-form-change-trigger";

export class SpeciesFormChangeManualTrigger extends SpeciesFormChangeTrigger {
  override canChange(_pokemon: Pokemon): boolean {
    return true;
  }
}
