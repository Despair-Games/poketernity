import { SpeciesFormChangeMoveTrigger } from "#app/data/species-form-change-triggers/species-form-change-move-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";

export class SpeciesFormChangePreMoveTrigger extends SpeciesFormChangeMoveTrigger {
  override canChange(pokemon: Pokemon): boolean {
    const command = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
    return !!command?.turnMove && this.movePredicate(command.turnMove.move.id) === this.used;
  }
}
