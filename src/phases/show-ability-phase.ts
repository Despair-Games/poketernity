import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { PokemonPhase } from "./pokemon-phase";

export class ShowAbilityPhase extends PokemonPhase {
  private passive: boolean;

  constructor(battlerIndex: BattlerIndex, passive: boolean = false) {
    super(battlerIndex);

    this.passive = passive;
  }

  override start() {
    super.start();

    const pokemon = this.getPokemon();

    if (pokemon) {
      globalScene.abilityBar.showAbility(pokemon, this.passive);

      if (pokemon?.battleData) {
        pokemon.battleData.abilityRevealed = true;
      }
    }

    this.end();
  }
}
