import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";
import type { Moves } from "#enums/moves";

export class SpeciesFormChangeMoveLearnedTrigger extends SpeciesFormChangeTrigger {
  public move: Moves;
  public known: boolean;

  constructor(move: Moves, known: boolean = true) {
    super();
    this.move = move;
    this.known = known;
  }

  override canChange(pokemon: Pokemon): boolean {
    return !!pokemon.moveset.filter((m) => m.moveId === this.move).length === this.known;
  }
}
