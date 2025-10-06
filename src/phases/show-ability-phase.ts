import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { Phase } from "#app/phase";
import type { Pokemon } from "#field/pokemon";

export class ShowAbilityPhase extends Phase {
  public override readonly phaseName = "ShowAbilityPhase";

  private readonly pokemonName: string;
  private readonly abilityName: string;
  private readonly passive: boolean;
  private readonly isPlayer: boolean;

  constructor(pokemon: Pokemon, passive: boolean = false) {
    super();
    // TODO: Should this use `pokemon.name` instead?
    this.pokemonName = getPokemonNameWithAffix(pokemon);
    this.abilityName = passive ? pokemon.getPassiveAbility().name : pokemon.getAbility().name;
    this.passive = passive;
    this.isPlayer = pokemon.isPlayer();
  }

  public override start(): void {
    const abilityBar = this.isPlayer ? globalScene.playerAbilityBar : globalScene.enemyAbilityBar;
    abilityBar.show(this.pokemonName, this.abilityName, this.passive).then(this.end);
  }
}
