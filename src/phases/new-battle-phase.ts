import { globalScene } from "#app/global-scene";
import { BattlePhase } from "#phases/base/battle-phase";

/**
 * Triggers a new battle
 */
export class NewBattlePhase extends BattlePhase {
  public override readonly phaseName = "NewBattlePhase";

  public override start(): void {
    globalScene.newBattle();

    this.end();
  }
}
