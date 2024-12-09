import type Pokemon from "#app/field/pokemon";
import { SpeciesFormChangeTrigger } from "../pokemon-forms";

export class SpeciesFormChangeManualTrigger extends SpeciesFormChangeTrigger {
  override canChange(_pokemon: Pokemon): boolean {
    return true;
  }
}
