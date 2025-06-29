import { globalScene } from "#app/global-scene";
import { SwitchType } from "#enums/switch-type";
import { SpeciesFormChangeActiveTrigger } from "#form-change-triggers/species-form-change-active-trigger";
import { SwitchSummonPhase } from "#phases/switch-summon-phase";

export class ReturnPhase extends SwitchSummonPhase {
  public override readonly phaseName = "ReturnPhase";

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
