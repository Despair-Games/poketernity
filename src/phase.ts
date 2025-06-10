import { globalScene } from "#app/global-scene";
import type { PhaseMap } from "#app/phase-manager";
import type { PhaseKey } from "#types/phase-types";

export abstract class Phase {
  public abstract readonly phaseName: PhaseKey;

  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    globalScene.phaseManager.shiftPhase();
  }

  public is<P extends PhaseKey>(phaseKey: P): this is InstanceType<PhaseMap[P]> {
    return this.phaseName === phaseKey;
  }
}
