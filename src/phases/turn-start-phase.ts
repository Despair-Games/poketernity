import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { FieldPhase } from "#phases/abstract-field-phase";

export class TurnStartPhase extends FieldPhase {
  override readonly id = PhaseId.TURN_START;

  public override start(): void {
    super.start();

    globalScene.currentBattle.turnManager.startTurn();

    this.end();
  }
}
