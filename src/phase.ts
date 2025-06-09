import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { PHASES, type PhaseKey, type PhaseMap } from "#phases/phases";

export abstract class Phase {
  /** The identifier of the phase. Unique per phase, but **not** per instance! */
  public readonly id: PhaseId = PhaseId.UNSPECIFIED;

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
