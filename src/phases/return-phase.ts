import BattleScene from "#app/battle-scene";
import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import { SwitchSummonPhase } from "./switch-summon-phase";

export class ReturnPhase extends SwitchSummonPhase {
  constructor(scene: BattleScene, fieldIndex: integer) {
    super(scene, fieldIndex, -1, true, false);
  }

  override switchAndSummon(): void {
    this.end();
  }

  override summon(): void { }

  override onEnd(): void {
    const pokemon = this.getPokemon();

    pokemon.resetSprite();
    pokemon.resetTurnData();
    pokemon.resetSummonData();

    this.scene.updateFieldScale();

    this.scene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger);
  }
}
