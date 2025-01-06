import { globalScene } from "#app/global-scene";

export class Phase {
  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    globalScene.shiftPhase();
  }
}
