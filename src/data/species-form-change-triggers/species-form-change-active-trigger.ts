import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";

export class SpeciesFormChangeActiveTrigger extends SpeciesFormChangeTrigger {
  public active: boolean;

  constructor(active: boolean = false) {
    super();
    this.active = active;
  }

  override canChange(pokemon: Pokemon): boolean {
    return pokemon.isActive(true) === this.active;
  }
}
