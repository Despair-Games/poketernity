import { globalScene } from "#app/global-scene";
import type { EvolutionPhase } from "#app/phases/evolution-phase";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import type { MovePhase } from "#app/phases/move-phase";
import type { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import type { SwitchPhase } from "#app/phases/switch-phase";
import { PhaseId } from "#enums/phase-id";

export class Phase {
  protected _id: PhaseId = PhaseId.UNSPECIFIED;

  public get id(): PhaseId {
    return this._id;
  }

  public start(): void {
    if (globalScene.abilityBar.shown) {
      globalScene.abilityBar.resetAutoHideTimer();
    }
  }

  public end(): void {
    globalScene.shiftPhase();
  }

  isSwitchPhase(): this is SwitchPhase {
    return false;
  }

  isMovePhase(): this is MovePhase {
    return false;
  }

  isSelectModifierPhase(): this is SelectModifierPhase {
    return false;
  }

  isMoveEffectPhase(): this is MoveEffectPhase {
    return false;
  }

  isEvolutionPhase(): this is EvolutionPhase {
    return false;
  }
}
