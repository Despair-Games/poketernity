import { SpeciesFormChangeMoveTrigger } from "#app/data/species-form-change-triggers/species-form-change-move-trigger";
import type { Pokemon } from "#app/field/pokemon";

export class SpeciesFormChangePostMoveTrigger extends SpeciesFormChangeMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    return pokemon.summonData && pokemon.getLastXMoves(1).some((m) => this.movePredicate(m.move.id)) === this.used;
  }
}
