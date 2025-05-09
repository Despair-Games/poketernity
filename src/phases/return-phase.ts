import { globalScene } from "#app/global-scene";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { PhaseId } from "#enums/phase-id";
import { SwitchType } from "#enums/switch-type";
import { SpeciesFormChangeActiveTrigger } from "#form-change-triggers/species-form-change-active-trigger";

export class ReturnPhase extends SwitchSummonPhase {
  override readonly id = PhaseId.RETURN;

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
