import { globalScene } from "#app/global-scene";
import { BattlePhase } from "./battle-phase";

/**
 * Triggers a new battle
 * @extends BattlePhase
 */
export class NewBattlePhase extends BattlePhase {
  public override start(): void {
    super.start();

    globalScene.newBattle();

    this.end();
  }
}
