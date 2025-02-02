import { globalScene } from "#app/global-scene";
import type { EvolutionPhase } from "#app/phases/evolution-phase";

export class Phase {
  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    globalScene.shiftPhase();
  }

  public isEvolutionPhase(): this is EvolutionPhase {
    return false;
  }
}
