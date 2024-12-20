import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { Mode } from "#app/ui/ui";
import { LoginPhase } from "./login-phase";

export class UnavailablePhase extends Phase {
  public override start(): void {
    globalScene.ui.setMode(Mode.UNAVAILABLE, () => {
      globalScene.unshiftPhase(new LoginPhase(true));
      this.end();
    });
  }
}
