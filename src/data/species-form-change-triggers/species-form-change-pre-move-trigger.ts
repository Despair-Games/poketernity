import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeMoveTrigger } from "#form-change-triggers/species-form-change-move-trigger";

export class SpeciesFormChangePreMoveTrigger extends SpeciesFormChangeMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    const command = pokemon.turnData.turnCommand;
    return !!command?.turnMove && this.movePredicate(command.turnMove.move.id) === this.used;
  }
}
