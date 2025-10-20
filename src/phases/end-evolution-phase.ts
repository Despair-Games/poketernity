import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";
import type { MessageUiHandler } from "#ui/message-ui-handler";

/**
 * Resets the UI Mode after an evolution is finished.
 */
export class EndEvolutionPhase extends Phase {
  public override readonly phaseName = "EndEvolutionPhase";

  public override start(): void {
    globalScene.ui.setModeForceTransition<MessageUiHandler>(UiMode.MESSAGE).then(() => this.end());
  }
}
