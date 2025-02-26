import { SpeciesFormChangeMoveTrigger } from "#app/data/species-form-change-triggers/species-form-change-move-trigger";
import type { Pokemon } from "#app/field/pokemon";

export class SpeciesFormChangePreMoveTrigger extends SpeciesFormChangeMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    const command = pokemon.turnData.turnCommand;
    return !!command?.turnMove && this.movePredicate(command.turnMove.move.id) === this.used;
  }
}
