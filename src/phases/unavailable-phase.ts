import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";
import type { UnavailableModalUiHandler } from "#ui/unavailable-modal-ui-handler";

export class UnavailablePhase extends Phase {
  public override readonly phaseName = "UnavailablePhase";

  public override start(): void {
    globalScene.ui.setMode<UnavailableModalUiHandler>(UiMode.UNAVAILABLE, () => {
      globalScene.phaseManager.createAndUnshiftPhase("LoginPhase");
      this.end();
    });
  }
}
