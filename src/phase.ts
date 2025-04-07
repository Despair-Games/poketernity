import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";

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

  public is<T extends Phase = Phase>(phaseId: T["id"]): this is T {
    return this.id === phaseId;
  }
}
