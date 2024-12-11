import { globalScene } from "#app/global-scene";
import { phaseManager } from "#app/global-phase-manager";

export class Phase {
  start() {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  end() {
    phaseManager.shiftPhase();
  }
}
