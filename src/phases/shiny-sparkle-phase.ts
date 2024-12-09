import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { PokemonPhase } from "./pokemon-phase";

export class ShinySparklePhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  override start() {
    super.start();

    this.getPokemon().sparkle();
    globalScene.time.delayedCall(1000, () => this.end());
  }
}
