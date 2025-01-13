import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./abstract-pokemon-phase";

export class ShinySparklePhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    super.start();

    this.getPokemon().sparkle();
    globalScene.time.delayedCall(1000, () => this.end());
  }
}
