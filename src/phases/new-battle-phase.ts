import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

/**
 * Triggers a new battle
 */
export class NewBattlePhase extends Phase {
  public override readonly phaseName = "NewBattlePhase";

  public override start(): void {
    globalScene.newBattle();

    this.end();
  }
}
