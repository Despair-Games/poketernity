import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { PhaseId } from "#enums/phase-id";

export class ShowAbilityPhase extends PokemonPhase {
  override readonly id = PhaseId.SHOW_ABILITY;

  private readonly passive: boolean;

  constructor(battlerIndex: BattlerIndex, passive: boolean = false) {
    super(battlerIndex);

    this.passive = passive;
  }

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();

    if (pokemon) {
      globalScene.abilityBar.showAbility(pokemon, this.passive);
    }

    this.end();
  }
}
