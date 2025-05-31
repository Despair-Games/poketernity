import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeMoveTrigger } from "#form-change-triggers/species-form-change-move-trigger";

export class SpeciesFormChangePostMoveTrigger extends SpeciesFormChangeMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    return pokemon.getLastXMoves(1).some((m) => this.movePredicate(m.move.id)) === this.used;
  }
}
