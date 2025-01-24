import { globalScene } from "#app/global-scene";
import type { MovePhase } from "#app/phases/move-phase";
import type { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import type { SwitchPhase } from "#app/phases/switch-phase";

export class Phase {
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
}
