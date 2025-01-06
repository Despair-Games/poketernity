import { SpeciesFormChangeActiveTrigger } from "#app/data/pokemon-forms";
import { globalScene } from "#app/global-scene";
import { SwitchType } from "#enums/switch-type";
import { SwitchSummonPhase } from "./switch-summon-phase";

export class ReturnPhase extends SwitchSummonPhase {
  constructor(fieldIndex: number) {
    super(SwitchType.SWITCH, fieldIndex, -1, true);
  }

  protected override switchAndSummon(): void {
    this.end();
  }

  protected override summon(): void {}

  protected override onEnd(): void {
    const pokemon = this.getPokemon();

    pokemon.resetSprite();
    pokemon.resetTurnData();
    pokemon.resetSummonData();

    globalScene.updateFieldScale();

    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeActiveTrigger);
  }
}
