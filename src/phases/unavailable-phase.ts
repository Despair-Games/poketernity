import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { phaseManager } from "#app/phase-manager";
import { Mode } from "#app/ui/ui";
import { LoginPhase } from "./login-phase";

export class UnavailablePhase extends Phase {
  constructor() {
    super();
  }

  start(): void {
    globalScene.ui.setMode(Mode.UNAVAILABLE, () => {
      phaseManager.unshiftPhase(new LoginPhase(true));
      this.end();
    });
  }
}
