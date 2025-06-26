import { globalScene } from "#app/global-scene";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { PokemonPhase } from "#phases/base/pokemon-phase";

export class ShowAbilityPhase extends PokemonPhase {
  public override readonly phaseName = "ShowAbilityPhase";

  private readonly passive: boolean;

  constructor(battlerIndex: FieldBattlerIndex, passive: boolean = false) {
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
