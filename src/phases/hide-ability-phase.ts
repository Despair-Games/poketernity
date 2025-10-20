import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { Pokemon } from "#field/pokemon";

export class HideAbilityPhase extends Phase {
  public override readonly phaseName = "HideAbilityPhase";

  private readonly isPlayer: boolean;

  constructor(pokemon: Pokemon) {
    super();
    this.isPlayer = pokemon.isPlayer();
  }

  public override start(): void {
    const abilityBar = this.isPlayer ? globalScene.playerAbilityBar : globalScene.enemyAbilityBar;
    abilityBar.hide().then(this.end);
  }
}
