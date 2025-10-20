import { globalScene } from "#app/global-scene";
import type { PhaseKey, PhaseMap } from "#types/phase-types";

export abstract class Phase {
  public abstract readonly phaseName: PhaseKey;

  public abstract start(): void;

  public end(): void {
    globalScene.phaseManager.shiftPhase();
  }

  public is<P extends PhaseKey>(phaseKey: P): this is PhaseMap[P] {
    return this.phaseName === phaseKey;
  }
}
