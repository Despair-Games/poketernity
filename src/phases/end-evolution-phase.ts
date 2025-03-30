import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { MessageUiHandler } from "#app/ui/handlers/message-ui-handler";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";

/**
 * Resets the UI Mode after an evolution is finished.
 *
 * @extends Phase
 */
export class EndEvolutionPhase extends Phase {
  override readonly id = PhaseId.END_EVOLUTION;

  public override start(): void {
    super.start();

    globalScene.ui.setModeForceTransition<MessageUiHandler>(UiMode.MESSAGE).then(() => this.end());
  }
}
