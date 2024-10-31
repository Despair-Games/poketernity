import { gScene } from "#app/battle-scene";
import { BattlerIndex } from "#app/battle";
import { PokemonPhase } from "./pokemon-phase";

export class ShinySparklePhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  start() {
    super.start();

    this.getPokemon().sparkle();
    gScene.time.delayedCall(1000, () => this.end());
  }
}
