import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { PhaseId } from "#enums/phase-id";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";

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
