import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";

/**
 * Resets the UI Mode after an evolution is finished.
 *
 * @extends Phase
 */
export class EndEvolutionPhase extends Phase {
  public override start(): void {
    super.start();

    globalScene.ui.setModeForceTransition(UiMode.MESSAGE).then(() => this.end());
  }
}
