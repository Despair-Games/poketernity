import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";
import type { UnavailableModalUiHandler } from "#ui/unavailable-modal-ui-handler";

export class UnavailablePhase extends Phase {
  override readonly id = PhaseId.UNAVAILABLE;

  public override start(): void {
    globalScene.ui.setMode<UnavailableModalUiHandler>(UiMode.UNAVAILABLE, () => {
      globalScene.phaseManager.toLoginScreen({ showText: true, eager: true });
      this.end();
    });
  }
}
