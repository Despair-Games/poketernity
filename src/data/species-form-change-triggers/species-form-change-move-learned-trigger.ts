import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeTrigger } from "#form-change-triggers/species-form-change-trigger";

export class SpeciesFormChangeMoveLearnedTrigger extends SpeciesFormChangeTrigger {
  public move: MoveId;
  public known: boolean;

  constructor(move: MoveId, known: boolean = true) {
    super();
    this.move = move;
    this.known = known;
  }

  override canChange(pokemon: Pokemon): boolean {
    return pokemon.moveset.some((m) => m.moveId === this.move) === this.known;
  }
}
