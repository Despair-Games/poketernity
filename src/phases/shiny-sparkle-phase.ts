import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "#phases/base/pokemon-phase";

export class ShinySparklePhase extends PokemonPhase {
  public override readonly phaseName = "ShinySparklePhase";

  public override start(): void {
    this.getPokemon().sparkle();
    globalScene.time.delayedCall(1000, () => this.end());
  }
}
