import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

export class HideAbilityPhase extends Phase {
  public override readonly phaseName = "HideAbilityPhase";

  public override start(): void {
    globalScene.abilityBar.hide().then(this.end);
  }
}
