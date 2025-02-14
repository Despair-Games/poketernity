import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";
import type { MoveId } from "#enums/move-id";

export class SpeciesFormChangeMoveLearnedTrigger extends SpeciesFormChangeTrigger {
  public move: MoveId;
  public known: boolean;

  constructor(move: MoveId, known: boolean = true) {
    super();
    this.move = move;
    this.known = known;
  }

  override canChange(pokemon: Pokemon): boolean {
    return !!pokemon.moveset.filter((m) => m.moveId === this.move).length === this.known;
  }
}
