import { globalScene } from "#app/global-scene";
import { PHASES, type PhaseKey, type PhaseMap } from "#phases/phases";

export abstract class Phase {
  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    globalScene.phaseManager.shiftPhase();
  }

  public is<P extends PhaseKey>(phaseKey: P): this is InstanceType<PhaseMap[P]> {
    return this instanceof PHASES[phaseKey];
  }
}
