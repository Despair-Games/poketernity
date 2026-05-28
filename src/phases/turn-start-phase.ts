import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

export class TurnStartPhase extends Phase {
  public override readonly phaseName = "TurnStartPhase";

  public override start(): void {
    globalScene.currentBattle.turnManager.startTurn();

    this.end();
  }
}
