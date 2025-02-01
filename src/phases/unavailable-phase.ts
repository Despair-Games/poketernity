import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";

export class UnavailablePhase extends Phase {
  public override start(): void {
    globalScene.ui.setMode(UiMode.UNAVAILABLE, () => {
      globalScene.toLoginScreen({ showText: true });
      this.end();
    });
  }
}
