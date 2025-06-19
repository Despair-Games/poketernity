import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { BattlePhase } from "#phases/abstract-battle-phase";

/**
 * Triggers a new battle
 */
export class NewBattlePhase extends BattlePhase {
  override readonly id = PhaseId.NEW_BATTLE;

  public override start(): void {
    super.start();

    globalScene.newBattle();

    this.end();
  }
}
