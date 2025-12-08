import { globalScene } from "#app/global-scene";
import { BattlePhase } from "#phases/base/battle-phase";

export class TurnStartPhase extends BattlePhase {
  public override readonly phaseName = "TurnStartPhase";

  public override start(): void {
    globalScene.currentBattle.turnManager.startTurn();

    this.end();
  }
}
