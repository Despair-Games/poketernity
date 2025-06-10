import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";

export class ShowAbilityPhase extends PokemonPhase {
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
