import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { Phase } from "#app/phase";
import type { Pokemon } from "#field/pokemon";

export class ShowAbilityPhase extends Phase {
  public override readonly phaseName = "ShowAbilityPhase";

  private readonly pokemonName: string;
  private readonly abilityName: string;
  private readonly passive: boolean;

  constructor(pokemon: Pokemon, passive: boolean = false) {
    super();
    /** @todo Should this use `pokemon.name` instead? */
    this.pokemonName = getPokemonNameWithAffix(pokemon);
    this.abilityName = passive ? pokemon.getAbility().name : pokemon.getPassiveAbility().name;
    this.passive = passive;
  }

  public override start(): void {
    globalScene.abilityBar.show(this.pokemonName, this.abilityName, this.passive).then(this.end);
  }
}
