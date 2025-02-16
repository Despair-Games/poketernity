import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { PhaseId } from "#enums/phase-id";

export class ShinySparklePhase extends PokemonPhase {
  override readonly id = PhaseId.SHINY_SPARKLE;

  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    super.start();

    this.getPokemon().sparkle();
    globalScene.time.delayedCall(1000, () => this.end());
  }
}
