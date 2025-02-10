import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";

export class UnavailablePhase extends Phase {
  override readonly id = PhaseId.UNAVAILABLE;

  public override start(): void {
    globalScene.ui.setMode(UiMode.UNAVAILABLE, () => {
      globalScene.toLoginScreen({ showText: true, eager: true });
      this.end();
    });
  }
}
