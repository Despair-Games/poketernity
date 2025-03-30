import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { UnavailableModalUiHandler } from "#app/ui/handlers/unavailable-modal-ui-handler";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";

export class UnavailablePhase extends Phase {
  override readonly id = PhaseId.UNAVAILABLE;

  public override start(): void {
    globalScene.ui.setMode<UnavailableModalUiHandler>(UiMode.UNAVAILABLE, () => {
      globalScene.toLoginScreen({ showText: true, eager: true });
      this.end();
    });
  }
}
