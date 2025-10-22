import { globalScene } from "#app/global-scene";
import { FieldPhase } from "#phases/base/field-phase";

export class TurnStartPhase extends FieldPhase {
  public override readonly phaseName = "TurnStartPhase";

  public override start(): void {
    globalScene.currentBattle.turnManager.startTurn();

    this.end();
  }
}
