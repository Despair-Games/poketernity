import { BattlePhase } from "./battle-phase";

export class NewBattlePhase extends BattlePhase {
  override start() {
    super.start();

    this.scene.newBattle();

    this.end();
  }
}
